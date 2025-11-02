import express from "express";
import * as notificationController from "./notification.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Bulk notification routes
router.post("/overdue", protect, notificationController.sendOverdueNotifications);
router.post("/reminders", protect, notificationController.sendPaymentReminders);
router.post("/bulk", protect, notificationController.sendBulkNotifications);

// Manual notification routes
router.post("/invoice/:invoiceId", protect, notificationController.sendInvoiceNotification);
router.post("/payment/:paymentId/:invoiceId", protect, notificationController.sendPaymentNotification);

// Test route
router.post("/test", protect, notificationController.testEmail);

export default router;
