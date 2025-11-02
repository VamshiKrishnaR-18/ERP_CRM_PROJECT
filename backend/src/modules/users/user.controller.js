import * as userService from "./user.service.js";
import apiResponse from "../../utils/apiResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

// ✅ Create a new user
export const createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);

  if (!user) {
    throw new AppError("User creation failed", 400);
  }

  return apiResponse.success(res, user, "User created successfully", 201);
});

// ✅ Login user
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const token = await userService.loginUser(email, password);
  return apiResponse.success(res, { token }, "Login successful", 200);
});

export const logoutUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await userService.logoutUser(id);

  return apiResponse.success(res, null, "User logged out successfully!", 200);
});

// ✅ Get all users
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();
  return apiResponse.success(res, users, "Users fetched successfully!", 200);
});

// ✅ Get a user by ID
export const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return apiResponse.success(res, user, "User fetched successfully", 200);
});

// ✅ Delete a user (soft delete)
export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await userService.deleteUser(id);
  if (!deletedUser) {
    throw new AppError("User deletion failed", 400);
  }

  return apiResponse.success(
    res,
    deletedUser,
    "User deleted successfully",
    200
  );
});

// ✅ Reactivate a user
export const reactivateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reactivatedUser = await userService.reactivateUser(id);
  if (!reactivatedUser) {
    throw new AppError("User reactivation failed", 400);
  }

  return apiResponse.success(
    res,
    reactivatedUser,
    "User reactivated successfully!",
    200
  );
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) throw new AppError("new password is required", 400);

  const updated = await userService.resetPassword(id, newPassword);

  return apiResponse.success(res, updated, "Password reset successfull!");
});
