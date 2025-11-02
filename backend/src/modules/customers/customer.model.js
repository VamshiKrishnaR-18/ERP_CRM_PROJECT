import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
    index: true,
  },

  phone: { type: String, trim: true, unique: true, required: true },

  address: { type: String, trim: true, required: true },

  company: { type: String, trim: true },

  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  enabled: {
    type: Boolean,
    default: true,
  },
}, {timestamps: true});

export default mongoose.model("Customer", customerSchema);
