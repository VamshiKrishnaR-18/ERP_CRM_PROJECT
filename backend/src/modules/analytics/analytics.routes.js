import express from "express";
import * as analyticsController from "./analytics.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard and summary routes
router.get("/dashboard", protect, analyticsController.getDashboardSummary);
router.get("/business-intelligence", protect, analyticsController.getBusinessIntelligenceReport);

// Specific analytics routes
router.get("/revenue", protect, analyticsController.getRevenueAnalytics);
router.get("/customers", protect, analyticsController.getCustomerAnalytics);
router.get("/payments", protect, analyticsController.getPaymentAnalytics);
router.get("/invoice-status", protect, analyticsController.getInvoiceStatusAnalytics);

export default router;
