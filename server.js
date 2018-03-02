import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';

import {} from 'dotenv/config';

import config from './config';
import router from './routes';

// Initialize Express
const app = express();

// Enable Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(passport.initialize());

// Load routes
app.use('/auth', router.auth);
app.use('/api', router.api);
  
// Listen on port 3000 when not in production
const PORT = process.env.PORT || 3001
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}.`);
});
