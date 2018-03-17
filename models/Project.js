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

// Define a Template Schema
const templateSchema = new mongoose.Schema({
  filePath: {
    type: String,
    trim: true,
    required: true
  },
  comments: {
    type: String,
    trim: true,
    required: false,
    default: ""
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
<<<<<<< HEAD
      type: [templateSchema]
=======
      type: [ String ],
      trim: true   
>>>>>>> 92041ab2cd7a15023397ed612143cdd7b1e5f42b
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
