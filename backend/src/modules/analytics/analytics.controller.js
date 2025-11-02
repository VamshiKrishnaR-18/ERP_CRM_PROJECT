import { catchAsync } from "../../utils/catchAsync.js";
import apiResponse from "../../utils/apiResponse.js";
import { AppError } from "../../utils/AppError.js";
import analyticsService from "../../services/analyticsService.js";

// Get revenue analytics
export const getRevenueAnalytics = catchAsync(async (req, res, next) => {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    
    if (!startDate || !endDate) {
        throw new AppError("Start date and end date are required", 400);
    }

    const analytics = await analyticsService.getRevenueAnalytics(startDate, endDate, groupBy);
    return apiResponse.success(res, analytics, "Revenue analytics fetched successfully!", 200);
});

// Get customer analytics
export const getCustomerAnalytics = catchAsync(async (req, res, next) => {
    const analytics = await analyticsService.getCustomerAnalytics();
    return apiResponse.success(res, analytics, "Customer analytics fetched successfully!", 200);
});

// Get payment analytics
export const getPaymentAnalytics = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
        throw new AppError("Start date and end date are required", 400);
    }

    const analytics = await analyticsService.getPaymentAnalytics(startDate, endDate);
    return apiResponse.success(res, analytics, "Payment analytics fetched successfully!", 200);
});

// Get invoice status analytics
export const getInvoiceStatusAnalytics = catchAsync(async (req, res, next) => {
    const analytics = await analyticsService.getInvoiceStatusAnalytics();
    return apiResponse.success(res, analytics, "Invoice status analytics fetched successfully!", 200);
});

// Get comprehensive business intelligence report
export const getBusinessIntelligenceReport = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
        throw new AppError("Start date and end date are required", 400);
    }

    const report = await analyticsService.getBusinessIntelligenceReport(startDate, endDate);
    return apiResponse.success(res, report, "Business intelligence report generated successfully!", 200);
});

// Get dashboard summary
export const getDashboardSummary = catchAsync(async (req, res, next) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Last 30 days

    const [
        revenueAnalytics,
        customerAnalytics,
        statusAnalytics
    ] = await Promise.all([
        analyticsService.getRevenueAnalytics(startDate, endDate, 'day'),
        analyticsService.getCustomerAnalytics(),
        analyticsService.getInvoiceStatusAnalytics()
    ]);

    const summary = {
        revenue: {
            total: revenueAnalytics.summary.totalRevenue,
            growth: revenueAnalytics.summary.averageGrowthRate,
            trend: revenueAnalytics.data.slice(-7) // Last 7 days
        },
        customers: {
            total: customerAnalytics.summary.totalCustomers,
            active: customerAnalytics.summary.activeCustomers,
            topCustomers: customerAnalytics.summary.topCustomers.slice(0, 5)
        },
        invoices: {
            total: statusAnalytics.summary.totalInvoices,
            overdue: statusAnalytics.summary.overdueCount,
            overdueValue: statusAnalytics.summary.overdueValue
        },
        period: { startDate, endDate }
    };

    return apiResponse.success(res, summary, "Dashboard summary fetched successfully!", 200);
});
