import express from "express";
import validate from "../../middleware/validate.js";
import { createInvoiceSchema, getInvoicesSchema} from "./invoice.validation.js";
import * as invoiceController from "./invoice.controller.js";
import * as recurringInvoiceController from "./recurringInvoice.controller.js";
import {protect} from "../../middleware/authMiddleware.js";
import { uploadSingle, uploadMultiple } from "../../middleware/upload.js";

const router = express.Router();

// Basic CRUD operations
router.post("/createInvoice",validate(createInvoiceSchema), protect, invoiceController.createInvoice);
router.get("/getAllInvoices",validate(getInvoicesSchema), protect, invoiceController.getAllInvoices);
router.get("/getInvoice/:id", protect, invoiceController.getInvoiceById);
router.patch("/updateInvoice/:id", protect, invoiceController.updateInvoice);
router.delete("/deleteInvoice/:id", protect, invoiceController.softDeleteInvoice);

// Analytics and reporting
router.get("/getInvoiceSummary", protect, invoiceController.getInvoiceSummary);
router.get("/analyzeClientInvoices/:clientId", protect, invoiceController.analyzeClientInvoices);

// File attachment operations
router.post("/:id/attachments", protect, uploadSingle, invoiceController.uploadAttachment);
router.post("/:id/attachments/multiple", protect, uploadMultiple, invoiceController.uploadMultipleAttachments);
router.get("/:id/attachments", protect, invoiceController.listAttachments);
router.get("/:id/attachments/:attachmentId/download", protect, invoiceController.downloadAttachment);
router.delete("/:id/attachments/:attachmentId", protect, invoiceController.removeAttachment);

// Recurring invoice operations
router.post("/recurring/templates", protect, recurringInvoiceController.createRecurringTemplate);
router.get("/recurring/templates", protect, recurringInvoiceController.getRecurringTemplates);
router.patch("/recurring/templates/:id", protect, recurringInvoiceController.updateRecurringTemplate);
router.delete("/recurring/templates/:id", protect, recurringInvoiceController.deleteRecurringTemplate);
router.post("/recurring/templates/:id/generate", protect, recurringInvoiceController.triggerRecurringInvoice);
router.post("/recurring/process-all", protect, recurringInvoiceController.processAllRecurringInvoices);

export default router