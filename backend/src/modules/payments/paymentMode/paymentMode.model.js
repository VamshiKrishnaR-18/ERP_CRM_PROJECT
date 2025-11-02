const mongoose = require("mongoose");

const paymentModeSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },

  enabled: { type: Boolean, default: true },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    required:true,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    autopopulate: true,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
  ref:{
    type: String,
  }
});

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
