// import passport from 'passport';
import aws from 'aws-sdk';
import dot from 'dot';
import fs, { write } from 'fs';
import git from 'simple-git/promise';
import path from 'path';
import targz from 'targz';
import tmp from 'tmp';

import { Router } from 'express';

import { Project } from '../models';

const router = Router();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AES_SECRET_ACCESS_KEY
});

const s3 = new aws.S3();

// Promise wrapper functions

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

function s3GetSignedUrlP(s3params) {
  console.log("In s3getsignedurlp");
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

function s3UploadFileP(s3params) {
  return new Promise(function(resolve, reject) {
    s3.upload(s3params, (err, response) => {
      if (err) reject(err);
      const rv = response;
      resolve(rv);
    });
  });
};

function readFileP(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function writeFileP(filePath, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// Helper functions

async function fetchGitRepo(gitUri, gitRefSpec) {
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
    await repo.fetch('origin', gitRefSpec);

    // Checkout the branch
    console.log("Checking out branch");
    await repo.checkout(['--track', `origin/${gitRefSpec}`]);

    return { workPath, cleanupCallback };

  } catch(err) {
    console.log(err);
    throw(err);
  }
}

async function makeBundle(repoPath, bundlePath) {
  const templates = ['/hello.txt'];
  const templateData = {
    'name': "HotPlate"
  };

  templates.forEach(async (t) => {
    const templatePath = `${repoPath}${t}`;
    const templateSrc = await readFileP(templatePath);
    const rendered = dot.template(templateSrc)(templateData);
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

router.get("/", function (req, res) {
  Project.find().then((projectData, err) => {
    res.json(projectData);
  });
});

router.get("/:id", function (req, res) {
  Project.findOne({ '_id': req.params.id }).then(async (projectData, err) => {
    let bundleUrl = null;
    if (req.query.render === "true") {
      const { workPath, cleanupCallback } = await fetchGitRepo(projectData.gitUri, projectData.gitRefSpec);
      const repoPath = `${workPath}/repo`;
      const bundlePath = `${workPath}/${req.params.id}.tgz`;
      const bundleResult = await makeBundle(repoPath, bundlePath);
      const uploadResult = await uploadToS3(bundlePath, 'application/x-gzip');
      bundleUrl = uploadResult.Location;
    }
    console.log(bundleUrl);
    projectData = projectData.toObject();
    projectData["downloadUrl"] = bundleUrl;
    console.log(JSON.stringify(projectData));
    res.json(projectData);
  });
});

// This works, but is grotesque.. Convert this mess to async/await and break it up into small functions
router.post("/", (req, res) => {
  // Create a Project with the data available to us in req.body
  console.log(req.body);
  const newProjectObj = {
    name: req.body.name,
    gitUri: req.body.gitUri,
    gitRefSpec: req.body.gitRefSpec
  };
  // Re-order logic so that existing Project check happens after retrieval of project from Git repo
  // That way, the name attribute can be taken from the hotplate.json
  Project.findOne({ name: newProjectObj.name }).then((existingDbProject, err) => {
    console.log(`In Project.findOne. newProjectObj: ${JSON.stringify(newProjectObj)}. err: ${JSON.stringify(err)}. existingDbProject: ${JSON.stringify(existingDbProject)}`)
    if (existingDbProject) {
      res.status(409).json({ error: "PROJECT_EXISTS"});
    } else {

      // Create temp work directory
      tmp.dir((err, workPath, cleanupCallback) => {
        if (err) throw err;
        // Retrieve git repo
        const repoPath = workPath + '/repo';
        fs.mkdirSync(repoPath);
        const repo = git(repoPath);
        repo.init()
          .then(() => {
            console.log("Adding git remote...");
            return repo.addRemote('origin', newProjectObj.gitUri)
          })
          .then(() => {
            // Add handling for fetch failures
            console.log("Fetching from git...");
            return repo.fetch('origin', newProjectObj.gitRefSpec);
          })
          .then(() => {
            console.log("Checking out git ref...");
            return repo.checkout(['--track', `origin/${newProjectObj.gitRefSpec}`]);
          })
          .then(() => {
            // Add logic here to return a sane http failure response on failure instead of crash
            console.log("Opening hotplate.json...");
            const hotplateJsonPath = `${repoPath}/hotplate.json`;
            //console.log(hotplateJsonPath);
            const hotplateJson = fs.readFileSync(hotplateJsonPath, { encoding: 'utf8' });
            //console.log(hotplateJson);
            const hotplateData = JSON.parse(hotplateJson);
            return hotplateData;
          })
          .then((hotplateData) => {
            // Read project attributes from hotplate.json
            // Add attribs to newProjectObj
            console.log(`Hotplate data read from repo: ${JSON.stringify(hotplateData)}`);
            //newProjectObj["name"] = hotplateData.name;
            newProjectObj["description"] = hotplateData.description;
            newProjectObj["params"] = hotplateData.params;
            // Add Project to db
            console.log("Making the project.");
            Project.create(newProjectObj).then((err, newDbProject) => {
              res.status(200).json(newProjectObj);
            });
          });
        // Manual cleanup 
        //cleanupCallback();
      });  
    }
  });
});

// router.get("/unprotected", function (req, res) {
//   res.json({"message": "Hello from the /api/unprotected GET endpoint"});
// });

// router.get("/protected", passport.authenticate('jwt', { session: false }), function (req, res) {
//   res.json({"message": "Hello from the /api/protected GET endpoint"});
// });

export default router;