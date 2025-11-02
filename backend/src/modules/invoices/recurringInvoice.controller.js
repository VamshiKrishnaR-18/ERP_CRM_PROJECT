import { catchAsync } from "../../utils/catchAsync.js";
import apiResponse from "../../utils/apiResponse.js";
import { AppError } from "../../utils/AppError.js";
import recurringInvoiceService from "../../services/recurringInvoiceService.js";

// Create recurring invoice template
export const createRecurringTemplate = catchAsync(async (req, res, next) => {
    const template = await recurringInvoiceService.createRecurringTemplate(req.body, req.user?.id);
    return apiResponse.success(res, template, "Recurring invoice template created successfully!", 201);
});

// Get all recurring templates
export const getRecurringTemplates = catchAsync(async (req, res, next) => {
    const templates = await recurringInvoiceService.getRecurringTemplates(req.user?.id);
    return apiResponse.success(res, templates, "Recurring templates fetched successfully!", 200);
});

// Update recurring template
export const updateRecurringTemplate = catchAsync(async (req, res, next) => {
    const template = await recurringInvoiceService.updateRecurringTemplate(
        req.params.id, 
        req.body, 
        req.user?.id
    );
    return apiResponse.success(res, template, "Recurring template updated successfully!", 200);
});

// Delete recurring template
export const deleteRecurringTemplate = catchAsync(async (req, res, next) => {
    const template = await recurringInvoiceService.deleteRecurringTemplate(
        req.params.id, 
        req.user?.id
    );
    return apiResponse.success(res, template, "Recurring template deleted successfully!", 200);
});

// Manually trigger recurring invoice generation
export const triggerRecurringInvoice = catchAsync(async (req, res, next) => {
    const result = await recurringInvoiceService.triggerRecurringInvoice(req.params.id);
    return apiResponse.success(res, result, "Recurring invoice generated successfully!", 200);
});

// Process all recurring invoices (manual trigger)
export const processAllRecurringInvoices = catchAsync(async (req, res, next) => {
    const result = await recurringInvoiceService.processRecurringInvoices();
    return apiResponse.success(res, result, "All recurring invoices processed successfully!", 200);
});
