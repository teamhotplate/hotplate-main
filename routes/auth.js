import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { authConfig } from '../config';
import { Router } from 'express';
import { User } from '../models';

const router = Router();

// User registration and login routes

router.post("/users", (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, function(err) {
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
    // Send Set-Cookie header. More secure than local-storage for browser clients.
    res.cookie('jwt', token, authConfig.cookie);

    // Return json web token. For use by non-browser clients.
    return res.json({
      jwt: token
    });
  });
});

export default router;
