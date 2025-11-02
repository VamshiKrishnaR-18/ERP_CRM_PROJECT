import { catchAsync } from "../../utils/catchAsync.js";
import apiResponse from "../../utils/apiResponse.js";
import { AppError } from "../../utils/AppError.js";
import exportService from "../../services/exportService.js";
import fs from "fs";

// Export invoices to Excel
export const exportInvoicesToExcel = catchAsync(async (req, res, next) => {
    const filters = req.query;
    const result = await exportService.exportInvoicesToExcel(filters);
    
    return apiResponse.success(res, {
        message: "Invoices exported successfully",
        filename: result.filename,
        recordCount: result.recordCount,
        downloadUrl: `/exports/download/${result.filename}`
    }, "Invoices exported to Excel successfully!", 200);
});

// Export customers to CSV
export const exportCustomersToCSV = catchAsync(async (req, res, next) => {
    const filters = req.query;
    const result = await exportService.exportCustomersToCSV(filters);
    
    return apiResponse.success(res, {
        message: "Customers exported successfully",
        filename: result.filename,
        recordCount: result.recordCount,
        downloadUrl: `/exports/download/${result.filename}`
    }, "Customers exported to CSV successfully!", 200);
});

// Export payments to CSV
export const exportPaymentsToCSV = catchAsync(async (req, res, next) => {
    const filters = req.query;
    const result = await exportService.exportPaymentsToCSV(filters);
    
    return apiResponse.success(res, {
        message: "Payments exported successfully",
        filename: result.filename,
        recordCount: result.recordCount,
        downloadUrl: `/exports/download/${result.filename}`
    }, "Payments exported to CSV successfully!", 200);
});

// Generate PDF report
export const generatePDFReport = catchAsync(async (req, res, next) => {
    const { reportType } = req.params;
    const data = req.body;
    
    if (!reportType) {
        throw new AppError("Report type is required", 400);
    }

    const result = await exportService.generatePDFReport(reportType, data);
    
    return apiResponse.success(res, {
        message: "PDF report generated successfully",
        filename: result.filename,
        downloadUrl: `/exports/download/${result.filename}`
    }, "PDF report generated successfully!", 200);
});

// Create complete data backup
export const createDataBackup = catchAsync(async (req, res, next) => {
    const result = await exportService.createDataBackup();
    
    return apiResponse.success(res, {
        message: "Data backup created successfully",
        filename: result.filename,
        size: result.size,
        files: result.files,
        downloadUrl: `/exports/download/${result.filename}`
    }, "Data backup created successfully!", 200);
});

// Download exported file
export const downloadFile = catchAsync(async (req, res, next) => {
    const { filename } = req.params;
    
    if (!filename) {
        throw new AppError("Filename is required", 400);
    }

    const filepath = `./uploads/exports/${filename}`;
    
    if (!fs.existsSync(filepath)) {
        throw new AppError("File not found", 404);
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Determine content type based on file extension
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'xlsx':
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            break;
        case 'csv':
            res.setHeader('Content-Type', 'text/csv');
            break;
        case 'pdf':
            res.setHeader('Content-Type', 'application/pdf');
            break;
        case 'zip':
            res.setHeader('Content-Type', 'application/zip');
            break;
        default:
            res.setHeader('Content-Type', 'application/octet-stream');
    }

    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
});

// List available export files
export const listExportFiles = catchAsync(async (req, res, next) => {
    const exportDir = './uploads/exports';
    
    if (!fs.existsSync(exportDir)) {
        return apiResponse.success(res, [], "No export files found", 200);
    }

    const files = fs.readdirSync(exportDir).map(filename => {
        const filepath = `${exportDir}/${filename}`;
        const stats = fs.statSync(filepath);
        
        return {
            filename,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            downloadUrl: `/exports/download/${filename}`
        };
    }).sort((a, b) => b.createdAt - a.createdAt);

    return apiResponse.success(res, files, "Export files listed successfully!", 200);
});

// Delete export file
export const deleteExportFile = catchAsync(async (req, res, next) => {
    const { filename } = req.params;
    
    if (!filename) {
        throw new AppError("Filename is required", 400);
    }

    const filepath = `./uploads/exports/${filename}`;
    
    if (!fs.existsSync(filepath)) {
        throw new AppError("File not found", 404);
    }

    fs.unlinkSync(filepath);
    
    return apiResponse.success(res, null, "Export file deleted successfully!", 200);
});

// Cleanup old export files
export const cleanupOldExports = catchAsync(async (req, res, next) => {
    const { daysOld = 7 } = req.query;
    const result = await exportService.cleanupOldExports(parseInt(daysOld));
    
    return apiResponse.success(res, result, `Cleaned up ${result.deletedCount} old export files`, 200);
});

// Export data based on type
export const exportData = catchAsync(async (req, res, next) => {
    const { type, format } = req.params;
    const filters = req.query;
    
    let result;
    
    switch (type) {
        case 'invoices':
            if (format === 'excel') {
                result = await exportService.exportInvoicesToExcel(filters);
            } else {
                throw new AppError("Invalid format for invoices. Use 'excel'", 400);
            }
            break;
        case 'customers':
            if (format === 'csv') {
                result = await exportService.exportCustomersToCSV(filters);
            } else {
                throw new AppError("Invalid format for customers. Use 'csv'", 400);
            }
            break;
        case 'payments':
            if (format === 'csv') {
                result = await exportService.exportPaymentsToCSV(filters);
            } else {
                throw new AppError("Invalid format for payments. Use 'csv'", 400);
            }
            break;
        default:
            throw new AppError("Invalid export type", 400);
    }
    
    return apiResponse.success(res, {
        message: `${type} exported successfully`,
        filename: result.filename,
        recordCount: result.recordCount,
        downloadUrl: `/exports/download/${result.filename}`
    }, `${type} exported successfully!`, 200);
});
