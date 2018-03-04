import mongoose from 'mongoose';
// import passportLocalMongoose from 'passport-local-mongoose';

// Define a Param Schema
const paramSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  paramType: {
    type: String,
    trim: true,
    required: true,
    default: "String"
  }
});

// Define a Project Schema
const projectSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    gitUri: {
      type: String,
      trim: true,
      required: true
    },
    gitRefSpec: {
      type: String,
      trim: true,
      required: true,
      default: "master"
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    params: {
      type: [paramSchema]
    }
  });

// Create a Project Model from the above-defined Schema
const ProjectModel = mongoose.model("Project", projectSchema);

// Export the Project model
export default ProjectModel;
