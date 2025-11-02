import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const paymentSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    autopopulate: true,
  },

  number: {
    type: Number,
    required: true,
  },

  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: true,
    autopopulate: true,
  },

  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: "Invoice",
    required: true,
    autopopulate: true,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: mongoose.Schema.ObjectId,
    ref: "paymentMode",
    autopopulate: true,
  },

  ref: {
    type: String,
  },

  description: {
    type: String,
  },

  updated: {
    type: Date,
    default: Date.now,
  },

  created: {
    type: Date,
    default: Date.now,
  },

});

paymentSchema.plugin(autopopulate)
export default mongoose.model('Payment', paymentSchema);
