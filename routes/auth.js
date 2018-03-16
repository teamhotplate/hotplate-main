import jwt from 'jsonwebtoken';
import passport from 'passport';
import { authConfig } from '../config';
import { Router } from 'express';
import { User } from '../models';

const router = Router();

// User registration and login routes

router.post("/users", (req, res) => {
  User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function(err) {
    if (err) {
      console.log("Error while registering user: ", err);
      return next();
    } else {
      console.log("User registered.");
      res.json({"result": "User successfully created."});
      //res.redirect('/');
    }
  });
});
  
router.post('/login', passport.authenticate('local'), (req, res) => {
  
  jwt.sign({ user: req.user }, authConfig.secret, (err, token) => {
    
    if (err) return res.json(err);

    // Browser will store jwt as http-only cookie, which is safer than keeping
    // the full token in local-storage, where it'd be accessible by javascript.
    res.cookie('jwt', token, authConfig.cookieOptions);

    // Return json web token in the json response body. For use by non-browser clients.
    // Browser clients will extract a couple key details (userId, userName) from the
    // jwt retrieved from the body, and discard it, using the http-only cookie (see above)
    // for authentication, instead.
    return res.json({
      jwt: token
    });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt', authConfig.cookieOptions);
  return res.end();
});

export default router;
