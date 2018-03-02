import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Router } from 'express';
import { User } from '../models';

const router = Router();

// Helper functions
// =============================================================
function verifyPassword(userObj, password) {
  // Expect password in database to be hashed
  if (bcrypt.compareSync(password, userObj.password)) {
    console.log("Password was correct.");
    return true;
  } else {
    console.log(JSON.stringify(userObj));
    console.log("Password was incorrect. It should have been: " + bcrypt.hashSync(password, 12));
    return false;
  }
}

// User registration and login routes

router.post("/users", (req, res) => {
  // Create a User with the data available to us in req.body
  console.log(req.body);
  const passwordHash = bcrypt.hashSync(req.body.password, 12);
  const newUserObj = {
    username: req.body.username,
    password: passwordHash
  };
  User.findOne({ username: newUserObj.username }).then((existingDbUser, err) => {
    console.log(`In User.findOne. newUserObj: ${JSON.stringify(newUserObj)}. err: ${JSON.stringify(err)}. existingDbUser: ${JSON.stringify(existingDbUser)}`)
    if (existingDbUser) {
      res.status(409).json({ error: "USERNAME_EXISTS"});
    } else {
      User.create(newUserObj).then((err, newDbUser) => {
        // Censor the password hash
        newUserObj.password = null;
        res.status(200).json(newUserObj);
      });
    }
  });
});

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }).then((user, err) => {
    //console.log(JSON.stringify(user));
    if (!user) {
      console.log("Auth failed. User not found in database.");
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else if (!verifyPassword(user, req.body.password)) {
      console.log("Auth failed. User found in db, but wrong password.");
      res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
    } else {
      console.log("Auth succeeded. User found in db, and password matched.");
      const token = jwt.sign({user_id: user._id, username: user.username}, process.env.JWTSECRET, {
        expiresIn: 8 * 60 * 60 // in seconds -- 8 hrs x 60mins/hr x 60secs/min
      });
      res.json({ success: true, token: 'JWT ' + token });
    }
  }).catch((err) => {
    res.status(500).json({ 'status': false, 'message': "Unknown error during authentication." });
  });
});

export default router;
