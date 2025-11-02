import express from "express";
import * as paymentController from "./payment.controller.js";
import {protect} from "../../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/createPayment", protect, paymentController.createPayment);
router.get("/getAllPayments", protect, paymentController.getAllPayments);
router.get("/getPayment/:id", protect, paymentController.getPaymentById);

router.patch("/updatePayment/:id", protect, paymentController.updatePayment);
router.delete("/deletePayment/:id", protect, paymentController.deletePayment);

router.get("/getPaymentHistory/:invoiceId", protect, paymentController.getPaymentHistory);

export default router;