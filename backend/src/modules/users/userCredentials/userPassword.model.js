import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userPasswordSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    passwordHash: {
      type: String,
      required: true,
    },

    resetToken:{
        type:String
    },

    resetTokenExpiry:{
        type:Date
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    authType: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },

    loggedSession: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userPasswordSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  const salt = await bcrypt.genSalt(process.env.NODE_ENV === "production" ? 12:10);

  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userPasswordSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model("UserPassword", userPasswordSchema);
