// import passport from 'passport';
import aws from 'aws-sdk';
import dot from 'dot';
import fs, { write } from 'fs';
import git from 'simple-git/promise';
import passport from 'passport';
import path from 'path';
import targz from 'targz';
import tmp from 'tmp';

import { Router } from 'express';

import { Bundle, Project } from '../models';

const router = Router();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AES_SECRET_ACCESS_KEY
});

const s3 = new aws.S3();

//  *****************************
//  * Promise wrapper functions *
//  *****************************

/*  Create a temporary working directory. Return the path of the new directory and 
 a callback that we call when done with the temp dir, to clean it up. */

function mkTempDirP() {
  return new Promise(function(resolve, reject) { 
    tmp.dir((err, workPath, cleanupCallback) => {
      if (err) reject(err);
      const rv = {
        workPath: workPath,
        cleanupCallback: cleanupCallback
      };
      resolve(rv);
    });
  });
}

/* Given a base path, and an output file path, create a tgz archive
 from the contents of the base path. */

function compressBundleP(basePath, bundlePath) {
  return new Promise(function(resolve, reject) {
    targz.compress({
      src: basePath,
      dest: bundlePath
    }, (err) => {
      if(err) {
          reject(err);
      } else {
          resolve();
      }
    });
  });
};

/*  Given an s3params dict (and our logged-in aws access id and secret)
 request pre-signing of a PUT request. The pre-signed request can be returned
 to a client, so the client can make S3 calls that require authentication,
 without having to share access creds with the client. */

function s3GetSignedUrlP(s3params) {
  return new Promise(function(resolve, reject) {
    s3.getSignedUrl('putObject', s3params, (err, response) => {
      if (err) reject(err);
      const rv = {
        signedRequest: response,
        url: `${s3params.Bucket}.s3.amazonaws.com/${s3params.Key}`
      };
      resolve(rv);
    });
  })
};

/* Given an s3params dict (and our logged-in aws access id and secret)
 upload an object to S3. The data to be uploaded is specified in
 the Body key of the s3params dict. */

function s3UploadFileP(s3params) {
  return new Promise(function(resolve, reject) {
    s3.upload(s3params, (err, response) => {
      if (err) reject(err);
      const rv = response;
      resolve(rv);
    });
  });
};

/*  Given a file path, read the file and return its contents. */

function readFileP(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

/* Given a file path and data, write the data to a file at
 the specifed path. */

function writeFileP(filePath, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

//  ********************
//  * Helper functions *
//  ********************

/* Given a GIT repository URI and branch (or tag) name
create a temporary directory, and fetch the specified tag/branch
into the /repo subdirectory of the temp directory. */

async function fetchGitRepo(gitUri, gitBranch) {
  try {

    // Create a temporary work directory
    console.log("Creating temp dir");
    const { workPath, cleanupCallback } = await mkTempDirP();

    // Create a subdirectory to store the repo we'll fetch
    console.log("Creating repo subdirectory");
    const repoPath = workPath + '/repo';
    fs.mkdirSync(repoPath);

    // Initialize a repo in the new directory
    console.log("Initializing repo");
    const repo = git(repoPath);
    await repo.init();

    // Add a remote for the repo
    console.log("Adding git remote");
    await repo.addRemote('origin', gitUri);

    // Fetch 
    console.log("Fetching");
    await repo.fetch('origin', gitBranch);

    // Checkout the branch
    console.log("Checking out branch");
    await repo.checkout(['--track', `origin/${gitBranch}`]);

    return { workPath, cleanupCallback };

  } catch(err) {
    console.log(err);
    throw(err);
  }
}

/* Perform template variable substitution on a specified subset of files in
   repoPath. Once done, roll repoPath up into a tgz archive. */

async function makeBundle(repoPath, bundlePath, templateList, templateInputList) {
  dot.templateSettings = {
    evaluate:    /\{\~\{([\s\S]+?)\}\~\}/g,
    interpolate: /\{\~\{=([\s\S]+?)\}\~\}/g,
    encode:      /\{\~\{!([\s\S]+?)\}\~\}/g,
    use:         /\{\~\{#([\s\S]+?)\}\~\}/g,
    define:      /\{\~\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\~\}/g,
    conditional: /\{\~\{\?(\?)?\s*([\s\S]*?)\s*\}\~\}/g,
    iterate:     /\{\~\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\~\})/g,
    varname: 'it',
    strip: false,
    append: true,
    selfcontained: false
  };
  let templateParams = {};
  templateParams = templateInputList.reduce((obj, templateInput) => {
    obj[templateInput.inputName] = templateInput.inputValue;
    return obj;
  }, templateParams);

  templateList.forEach(async (t) => {
    const templatePath = `${repoPath}${t.filePath}`;
    const templateSrc = await readFileP(templatePath);
    const rendered = dot.template(templateSrc)(templateParams);
    writeFileP(templatePath, rendered);
  });
  
  try {
    await compressBundleP(repoPath, bundlePath);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

/* Upload a specified file to S3. */

async function uploadToS3(filePath, fileType) {
  const s3bucketName = process.env.S3_BUCKET;
  const fileName = path.basename(filePath);
  const s3bucketUrl = `${s3bucketName}.s3.amazonaws.com/${fileName}`;
  const fileData = fs.createReadStream(filePath);

  const s3params = {
    Bucket: s3bucketName,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
    Body: fileData
  };

  const result = await s3UploadFileP(s3params);

  return result;
}

/* Read a hotplate.json file in, parse and return the contained object.. */

async function readHotplateJson(filePath) {
  console.log("Opening hotplate.json...");
  const hotplateJson = await readFileP(filePath);
  const hotplateData = JSON.parse(hotplateJson);
  return hotplateData;
}

/* Get all bundles */
router.get("/", async (req, res) => {
  console.log(`In bundles get-all route.`);
  let bundleData = [];
  try {
    bundleData = await Bundle.find({});
    res.json(bundleData);
  } catch(error) {
    console.error(error);
  }
});

/* Get specific bundle */
router.get("/:id", async (req, res) => {
  console.log(`In bundles get-by-id route.`);
  let bundleData = [];
  try {
    bundleData = await Bundle.findOne({_id: req.params.id}).populate('owner', 'username').populate('project', 'name gitUri gitBranch');
    res.json(bundleData);
  } catch(error) {
    console.error(error);
  }
});

/* Create a bundle */
router.post("/", passport.authenticate('jwt-cookiecombo', {
  session: false
}), async (req, res) => {
  const newBundleObj = req.body;
  let newBundleDb = null;

  try {
    newBundleObj['owner'] = req.user._id;
    newBundleDb = await Bundle.create(newBundleObj);
    newBundleDb = await Bundle.findOne({_id: newBundleDb._id})
      .populate('owner', 'username')
      .populate('project', 'name gitUri gitBranch templates');
  } catch(error) {
    console.error(error);
  }

  let bundleUrl = null;
  if (true) {
    const { workPath, cleanupCallback } = await fetchGitRepo(newBundleDb.project.gitUri, newBundleDb.project.gitBranch);
    const repoPath = `${workPath}/repo`;
    const bundlePath = `${workPath}/${newBundleDb._id}.tgz`;
    console.log(repoPath);
    const bundleResult = await makeBundle(repoPath, bundlePath, newBundleDb.project.templates, newBundleDb.inputs);
    const uploadResult = await uploadToS3(bundlePath, 'application/x-gzip');
    bundleUrl = uploadResult.Location;
    // Clean up temp directory
    // cleanupCallback();
  }

  console.log(bundleUrl);
  const bundleData = newBundleDb.toObject();
  bundleData["downloadUrl"] = bundleUrl;
  console.log(JSON.stringify(newBundleDb));
  res.json(bundleData);
});

export default router;