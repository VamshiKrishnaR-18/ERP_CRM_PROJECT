import {catchAsync} from "../../utils/catchAsync.js";
import * as invoiceService from "./invoice.service.js";
import apiResponse from "../../utils/apiResponse.js";
import { AppError } from "../../utils/AppError.js";

export const createInvoice = catchAsync(async (req, res, next) => {
    const {invoice, aiInsights} = await invoiceService.createInvoice(req.body, req.user?.id);
    return apiResponse.success(res, {invoice, aiInsights}, "Invoice created successfully!", 201);
});

export const getAllInvoices = catchAsync(async (req, res, next) => {
    const invoices = await invoiceService.getAllInvoices(req.query || {});
    return apiResponse.success(res, invoices, "Invoices fetched successfully!", 200);
});

export const getInvoiceById = catchAsync(async (req, res, next) => {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    return apiResponse.success(res, invoice, "Invoice fetched successfully!", 200);
});

export const updateInvoice = catchAsync(async (req, res, next) => {
    const {invoice, aiInsights} = await invoiceService.updateInvoice(req.params.id, req.body, req.user?.id);
    return apiResponse.success(res, {invoice, aiInsights}, "Invoice updated successfully!", 200);
});

export const softDeleteInvoice = catchAsync(async (req, res, next) => {
    const invoice = await invoiceService.softDeleteInvoice(req.params.id, req.user?.id);
    return apiResponse.success(res, invoice, "Invoice deleted successfully!", 200);
});

export const getInvoiceSummary = catchAsync(async (req, res, next) => {
    const summary = await invoiceService.getInvoiceSummary();
    return apiResponse.success(res, summary, "Invoice summary fetched successfully!", 200);
});

export const analyzeClientInvoices = catchAsync(async (req, res, next) => {
    const {stats, aiInsights} = await invoiceService.analyzeClientInvoices(req.params.clientId);
    return apiResponse.success(res, {stats, aiInsights}, "Client invoices analyzed successfully!", 200);
});


export const uploadAttachment = catchAsync(async (req, res, next) => {
    if (!req.file) {
        throw new AppError("No file uploaded!", 400);
    }
    const attachment = await invoiceService.addAttachment(
        req.params.id,
        req.file,
        req.body.description,
        req.user?.id
    );
    return apiResponse.success(res, attachment, "Attachment added successfully!", 200);
});

export const uploadMultipleAttachments = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        throw new AppError("No files uploaded!", 400);
    }
    const descriptions = req.body.descriptions ? JSON.parse(req.body.descriptions) : [];
    const attachments = await invoiceService.addMultipleAttachments(
        req.params.id,
        req.files,
        descriptions,
        req.user?.id
    );
    return apiResponse.success(res, attachments, "Attachments added successfully!", 200);
});

export const removeAttachment = catchAsync(async (req, res, next) => {
    const result = await invoiceService.removeAttachment(
        req.params.id,
        req.params.attachmentId,
        req.user?.id
    );
    return apiResponse.success(res, result, "Attachment removed successfully!", 200);
});

export const listAttachments = catchAsync(async (req, res, next) => {
    const attachments = await invoiceService.listAttachments(req.params.id);
    return apiResponse.success(res, attachments, "Attachments fetched successfully!", 200);
});

export const downloadAttachment = catchAsync(async (req, res, next) => {
    const attachment = await invoiceService.downloadAttachment(req.params.id, req.params.attachmentId);

    res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
    res.setHeader('Content-Type', attachment.mimetype);

    const fs = await import('fs');
    const fileStream = fs.createReadStream(attachment.path);
    fileStream.pipe(res);
});

export const getAttachments = catchAsync(async (req, res, next) => {
    const attachments = await invoiceService.listAttachments(req.params.id);
    return apiResponse.success(res, attachments, "Attachments fetched successfully!", 200);
});

export const deleteAttachment = catchAsync(async (req, res, next) => {
    await invoiceService.deleteAttachment(req.params.id, req.params.fileId);
    return apiResponse.success(res, null, "Attachment deleted successfully!", 200);
});