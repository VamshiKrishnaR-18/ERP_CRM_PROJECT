import express from "express";
import * as customerController from "./customer.controller.js";
import {protect} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createCustomer", protect, customerController.createCustomer);
router.get("/getCustomers", protect, customerController.getAllCustomers);
router.get("/getCustomer/:id", protect, customerController.getCustomerById);

router.patch("/updateCustomer/:id", protect, customerController.updateCustomer);
router.delete("/deleteCustomer/:id", protect, customerController.softDeleteCustomer);

router.patch("/disableCustomer/:id", protect, customerController.disableCustomer);
router.patch("/enableCustomer/:id", protect, customerController.enableCustomer);

export default router;
