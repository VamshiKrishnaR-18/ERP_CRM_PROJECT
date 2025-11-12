import jwt from "jsonwebtoken";
import User from "./user.model.js";
import UserPassword from "./userCredentials/userPassword.model.js";
import {AppError} from "../../utils/AppError.js";
import {env} from "../../config/env.js";
import * as UserPasswordService from "./userCredentials/userPassword.service.js";

// Create User
export const createUser = async (data) => {
  try {
    console.log("📝 Creating user with data:", { name: data.name, email: data.email, role: data.role });

    const { name, email, role, password } = data;

    if (!name || !email || !role || !password) {
      throw new AppError("Missing required fields: name, email, role, password", 400);
    }

    console.log("🔍 Checking if user already exists...");
    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered) {
      throw new AppError("Already Registered!", 400);
    }

    console.log("👤 Creating user document...");
    const user = await User.create({ name, email, role });
    console.log("✅ User created:", user._id);

    console.log("🔐 Creating password credentials...");
    await UserPasswordService.createCredentials(user._id, password);
    console.log("✅ Password credentials created");

    console.log("🎫 Generating JWT token...");
    const token = await UserPasswordService.generateToken(user);
    console.log("✅ Token generated");

    return { user, token };
  } catch (error) {
    console.error("❌ Error in createUser service:", error.message);
    throw error;
  }
};

// Login User
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found, please register!", 400);
  }

  if (user.removed) {
    throw new AppError("This account has been removed!. Contact Support.", 403);
  }

  if (!user.enabled) {
    throw new AppError(
      "Your account is naot active or diabled, Please vrify your email or contact admin.",
      403
    );
  }

  await UserPasswordService.verifyPassword(user._id, password);

  const token = await UserPasswordService.generateToken(user);

  await UserPasswordService.addLoggedSession(user._id, token);

  return token;
};

export const logoutUser = async (id) => {
  const user = await UserPasswordService.removeSession(id);

  if (!user) throw new AppError("User session not found", 404);

  return user;
};

// Get All Users
export const getAllUsers = async () => {
  const users = await User.find();
  if (!users || users.length === 0) {
    throw new AppError("No users found!", 404);
  }
  return users;
};

// Get User by ID
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user || user.removed) {
    throw new AppError("Failed to fetch user details", 404);
  }
  return user;
};

// Delete User
export const deleteUser = async (id) => {
  await UserPassword.findOneAndUpdate({ userId: id }, { removed: true });

  const isDeleted = await User.findByIdAndUpdate(id, {
    removed: true,
    enabled: false,
  });

  if (!isDeleted) {
    throw new AppError("User deletion failed!", 400);
  }

  return isDeleted;
};

export const reactivateUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 400);
  }

  if (user.enabled && !user.removed) {
    throw new AppError("User is already active", 400);
  }

  const updatedUser = User.findByIdAndUpdate(
    id,
    { enabled: true, removed: false },
    { new: true }
  );

  await UserPassword.findOneAndUpdate(
    { userId: id },
    { removed: false },
    { new: true }
  );

  return updatedUser;
};

export const resetPassword = async (id, newPassword) => {
  const updated = await UserPasswordService.resetPassword(id, newPassword);

  if (!updated) throw new AppError("Password reset Failed", 404);

  return updated;
};
