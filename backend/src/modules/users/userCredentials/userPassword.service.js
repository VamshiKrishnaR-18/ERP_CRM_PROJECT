import UserPassword from "./userPassword.model.js";
import { AppError } from "../../../utils/AppError.js";
import jwt from "jsonwebtoken";
import {env} from "../../../config/env.js";

export const createCredentials = async (userId, password) => {
  const existing = await UserPassword.findOne({ userId });

  if (existing) {
    throw new AppError("Password already created!", 400);
  }

  const credentials = new UserPassword({
    userId,
    passwordHash: password
  });

  return await credentials.save();
};

export const verifyPassword = async (userId, candidatePassword) => {
  const userCredentials = await UserPassword.findOne({ userId });

  if (!userCredentials) {
    throw new AppError("User Credentials Not Found!", 404);
  }

  const isMatch = await userCredentials.comparePassword(candidatePassword);

  if (!isMatch) {
    throw new AppError("Invalid Password!", 400);
  }

  return true;
};

export const markEmailVerified = async (userId) => {
  const updated = await UserPassword.findOneAndUpdate(
    { userId },
    { emailVerified: true },
    { new: true }
  );

  if (!updated) {
    throw new AppError("failed to mark email as verified!", 400);
  }

  return updated;
};

export const generateToken = async (user) => {
  if (!user?._id) throw new AppError("Invalid user", 404);

  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: "1d",
  });
};

export const addLoggedSession = async (userId, sessionId) => {
  const updated = await UserPassword.findOneAndUpdate(
    { userId },
    { loggedSession: sessionId },
    { new: true }
  );

  if (!updated) throw new AppError("Failled to add session", 400);

  return updated;
};

export const removeSession = async (userId) => {
  const removed = await UserPassword.findOneAndUpdate(
    { userId },
    { loggedSession: false },
    { new: true }
  );

  if (!removed) throw new AppError("Failed to remove session!");

  return removed;
};

export const resetPassword = async (userId, newPassword) => {
  const credentials = await UserPassword.findOne({ userId });

  if (!credentials) {
    throw new AppError("Credentials not found!", 404);
  }

  credentials.passwordHash = newPassword;

  credentials.resetToken = undefined;

  credentials.resetTokenExpiry = undefined;

  return await credentials.save();
};
