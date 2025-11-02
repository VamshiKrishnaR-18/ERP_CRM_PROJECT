import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },

    photo: { type: String, trim: true },

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
      required: true,
    },

    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },

    isActive:{
        type:Boolean,
        default:true
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
