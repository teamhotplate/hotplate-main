import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJwtCookieCombo from 'passport-jwt-cookiecombo';
import { User } from '../models';

// Auth Configuration
const authConfig = {
  secret: process.env.JWTSECRET,
  options: {
      //audience: 'https://gp3hotplate.herokuapp.com',
      //issuer: 'gp3hotplate.herokuapp.com',
      expiresIn: '12h' // 1d 
  },
  cookie: {
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: false
  }
}

// Enable JWT Cookie+Bearer Combo Strategy
passport.use(new passportJwtCookieCombo({
  secretOrPublicKey: authConfig.secret
}, (payload, done) => {
  return done(null, payload.user);
}));

// Enable Local+Mongoose strategy for intitial authentication and token generation
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default authConfig;