import mongoose from 'mongoose';

// Database configuration

// Set Mongoose to use ES6 Promise API, and connect to DB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

export default {};