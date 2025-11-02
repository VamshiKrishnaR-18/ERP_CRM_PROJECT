import express from "express";
import * as exportController from "./export.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Export routes
router.get("/invoices/excel", protect, exportController.exportInvoicesToExcel);
router.get("/customers/csv", protect, exportController.exportCustomersToCSV);
router.get("/payments/csv", protect, exportController.exportPaymentsToCSV);

// Generic export route
router.get("/:type/:format", protect, exportController.exportData);

// PDF report generation
router.post("/reports/:reportType/pdf", protect, exportController.generatePDFReport);

// Backup operations
router.post("/backup", protect, exportController.createDataBackup);

// File management
router.get("/files", protect, exportController.listExportFiles);
router.get("/download/:filename", exportController.downloadFile); // No auth for downloads
router.delete("/files/:filename", protect, exportController.deleteExportFile);
router.post("/cleanup", protect, exportController.cleanupOldExports);

export default router;
