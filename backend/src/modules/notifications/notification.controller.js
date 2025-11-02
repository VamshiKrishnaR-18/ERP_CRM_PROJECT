import { catchAsync } from "../../utils/catchAsync.js";
import apiResponse from "../../utils/apiResponse.js";
import { AppError } from "../../utils/AppError.js";
import notificationService from "../../services/notificationService.js";

// Send overdue invoice notifications
export const sendOverdueNotifications = catchAsync(async (req, res, next) => {
    const result = await notificationService.notifyOverdueInvoices();
    return apiResponse.success(res, result, "Overdue notifications sent successfully!", 200);
});

// Send payment reminder notifications
export const sendPaymentReminders = catchAsync(async (req, res, next) => {
    const { daysBefore = 3 } = req.query;
    const result = await notificationService.notifyPaymentReminders(parseInt(daysBefore));
    return apiResponse.success(res, result, "Payment reminders sent successfully!", 200);
});

// Send bulk notifications
export const sendBulkNotifications = catchAsync(async (req, res, next) => {
    const { type, filters } = req.body;
    
    if (!type) {
        throw new AppError("Notification type is required", 400);
    }

    const result = await notificationService.sendBulkNotifications(type, filters);
    return apiResponse.success(res, result, `${type} notifications sent successfully!`, 200);
});

// Test email functionality
export const testEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        throw new AppError("Email address is required", 400);
    }

    const result = await notificationService.testEmail(email);
    return apiResponse.success(res, result, "Test email sent successfully!", 200);
});

// Send invoice created notification manually
export const sendInvoiceNotification = catchAsync(async (req, res, next) => {
    const { invoiceId } = req.params;
    const result = await notificationService.notifyInvoiceCreated(invoiceId);
    return apiResponse.success(res, result, "Invoice notification sent successfully!", 200);
});

// Send payment received notification manually
export const sendPaymentNotification = catchAsync(async (req, res, next) => {
    const { paymentId, invoiceId } = req.params;
    const result = await notificationService.notifyPaymentReceived(paymentId, invoiceId);
    return apiResponse.success(res, result, "Payment notification sent successfully!", 200);
});
