import mongoose from 'mongoose';

// Define a Input Schema
const inputSchema = new mongoose.Schema({
  inputName: {
    type: String,
    trim: true,
    required: true
  },
  inputValue: {
    type: String,
    trim: true,
    required: true
  },
  inputType: {
    type: String,
    trim: true,
    required: true,
    default: "String"
  }
});

// Define a Bundle Schema
const bundleSchema = new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    inputs: {
      type: [inputSchema]
    },
    status: {
      type: String,
      trim: true,
      required: true,
      default: "requested"
    }
  });

// Create a Bundle Model from the above-defined Schema
const BundleModel = mongoose.model("Bundle", bundleSchema);

// Export the Bundle model
export default BundleModel;
