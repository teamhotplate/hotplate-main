import mongoose from 'mongoose';

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
    owner : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    gitUri: {
      type: String,
      trim: true,
      required: true
    },
    gitBranch: {
      type: String,
      trim: true,
      required: true,
      default: "master"
    },
    templates: {
      type: [ String ],
      trim: true   
    },
    params: {
      type: [paramSchema]
    },
    bundles : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bundle' }]
  });

projectSchema.index({ name: 'text', description: 'text' });

// Create a Project Model from the above-defined Schema
const ProjectModel = mongoose.model("Project", projectSchema);

// Export the Project model
export default ProjectModel;
