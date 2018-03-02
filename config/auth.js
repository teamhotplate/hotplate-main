import jwt from 'jsonwebtoken';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { User } from '../models';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWTSECRET;

const jwtStrategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // TO DO (Adrian)
  User.findOne({ _id: jwt_payload.user_id }).then((userData, err) => {
    console.log(userData);
    if (!userData) {
      console.log("In invalid creds handler. User was null.");
      return next(null, false, { message: 'Invalid user credentials.' });
    } else {
      console.log("In jwt success handler. User was not null.");
      return next(null, userData);
    }
  }).catch((err) => {
    return next(null, false, { message: 'Unknown error validating user token.' });
  });
});

passport.use(jwtStrategy);

export default {}