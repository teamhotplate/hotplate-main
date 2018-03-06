// import passport from 'passport';
import fs from 'fs';
import git from 'simple-git/promise';
import tmp from 'tmp';

import { Router } from 'express';

import { Project } from '../models';

const router = Router();

async function status (workingDir) {  
  let statusSummary = null;
  try {
     statusSummary = await git(workingDir).status();
  }
  catch (e) {
     // handle the error
  }
  
  return statusSummary;
}

router.get("/", function (req, res) {
  Project.find().then((projectData, err) => {
    res.json(projectData);
  });
});

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