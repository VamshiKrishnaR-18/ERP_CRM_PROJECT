import { Router } from "express";
import * as userController from "./user.controller.js";
import {protect} from "../../middleware/authMiddleware.js";

const router = Router();

//public routes
router.post("/register", userController.createUser);//
router.post("/login", userController.loginUser);
router.post("/logout/:id", userController.logoutUser);

//protected routes
router.get("/getUsers",protect, userController.getAllUsers);//
router.get("/getUser/:id", protect, userController.getUserById);
router.post("/reset-password/:id", protect, userController.resetPassword);
router.delete("/deleteUser/:id", userController.deleteUser);
router.patch("/reactivate/:id", userController.reactivateUser);//

export default router;
