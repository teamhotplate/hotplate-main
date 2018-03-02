import mongoose from 'mongoose';
// import passportLocalMongoose from 'passport-local-mongoose';

// Define a User Schema
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    }
  });

// Create a User Model from the above-defined Schema
const UserModel = mongoose.model("User", UserSchema);

// Export the User model
export default UserModel;
