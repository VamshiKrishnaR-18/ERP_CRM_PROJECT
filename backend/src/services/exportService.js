import ExcelJS from "exceljs";
import { createObjectCsvWriter } from "csv-writer";
import puppeteer from "puppeteer";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import Invoice from "../modules/invoices/invoice.model.js";
import Customer from "../modules/customers/customer.model.js";
import Payment from "../modules/payments/payment.model.js";
import { AppError } from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ExportService {
  constructor() {
    this.exportDir = path.join(process.cwd(), 'uploads', 'exports');
    this.ensureExportDirectory();
  }

  ensureExportDirectory() {
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  // Export invoices to Excel
  async exportInvoicesToExcel(filters = {}) {
    try {
      const invoices = await Invoice.find({ removed: false, ...filters })
        .populate('client')
        .populate('createdBy', 'name')
        .sort({ date: -1 });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Invoices');

      // Define columns
      worksheet.columns = [
        { header: 'Invoice ID', key: 'id', width: 15 },
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Due Date', key: 'expiredDate', width: 12 },
        { header: 'Customer', key: 'customer', width: 20 },
        { header: 'Customer Email', key: 'customerEmail', width: 25 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Payment Status', key: 'paymentStatus', width: 15 },
        { header: 'Currency', key: 'currency', width: 10 },
        { header: 'Subtotal', key: 'subTotal', width: 12 },
        { header: 'Tax', key: 'taxTotal', width: 12 },
        { header: 'Discount', key: 'discount', width: 12 },
        { header: 'Total', key: 'total', width: 12 },
        { header: 'Credit', key: 'credit', width: 12 },
        { header: 'Balance', key: 'balance', width: 12 },
        { header: 'Created By', key: 'createdBy', width: 15 },
        { header: 'Notes', key: 'notes', width: 30 }
      ];

      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data rows
      invoices.forEach(invoice => {
        worksheet.addRow({
          id: invoice._id.toString(),
          date: invoice.date.toISOString().split('T')[0],
          expiredDate: invoice.expiredDate.toISOString().split('T')[0],
          customer: invoice.client?.name || 'N/A',
          customerEmail: invoice.client?.email || 'N/A',
          status: invoice.status,
          paymentStatus: invoice.paymentStatus,
          currency: invoice.currency,
          subTotal: invoice.subTotal,
          taxTotal: invoice.taxTotal,
          discount: invoice.discount,
          total: invoice.total,
          credit: invoice.credit,
          balance: invoice.total - invoice.credit,
          createdBy: invoice.createdBy?.name || 'N/A',
          notes: invoice.notes || ''
        });
      });

      // Add items worksheet
      const itemsWorksheet = workbook.addWorksheet('Invoice Items');
      itemsWorksheet.columns = [
        { header: 'Invoice ID', key: 'invoiceId', width: 15 },
        { header: 'Item Name', key: 'itemName', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Price', key: 'price', width: 12 },
        { header: 'Discount', key: 'discount', width: 12 },
        { header: 'Tax Rate', key: 'taxRate', width: 10 },
        { header: 'Total', key: 'total', width: 12 }
      ];

      itemsWorksheet.getRow(1).font = { bold: true };
      itemsWorksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add items data
      invoices.forEach(invoice => {
        invoice.items.forEach(item => {
          itemsWorksheet.addRow({
            invoiceId: invoice._id.toString(),
            itemName: item.itemName,
            description: item.description || '',
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            taxRate: item.taxRate || 0,
            total: item.quantity * item.price
          });
        });
      });

      const filename = `invoices_export_${Date.now()}.xlsx`;
      const filepath = path.join(this.exportDir, filename);
      
      await workbook.xlsx.writeFile(filepath);
      
      return {
        filename,
        filepath,
        recordCount: invoices.length
      };
    } catch (error) {
      console.error('Failed to export invoices to Excel:', error);
      throw error;
    }
  }

  // Export customers to CSV
  async exportCustomersToCSV(filters = {}) {
    try {
      const customers = await Customer.find({ removed: false, ...filters })
        .populate('createdBy', 'name')
        .sort({ name: 1 });

      const filename = `customers_export_${Date.now()}.csv`;
      const filepath = path.join(this.exportDir, filename);

      const csvWriter = createObjectCsvWriter({
        path: filepath,
        header: [
          { id: 'id', title: 'Customer ID' },
          { id: 'name', title: 'Name' },
          { id: 'email', title: 'Email' },
          { id: 'phone', title: 'Phone' },
          { id: 'address', title: 'Address' },
          { id: 'company', title: 'Company' },
          { id: 'enabled', title: 'Enabled' },
          { id: 'createdBy', title: 'Created By' },
          { id: 'createdAt', title: 'Created Date' }
        ]
      });

      const records = customers.map(customer => ({
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        company: customer.company || '',
        enabled: customer.enabled,
        createdBy: customer.createdBy?.name || 'N/A',
        createdAt: customer.createdAt.toISOString().split('T')[0]
      }));

      await csvWriter.writeRecords(records);

      return {
        filename,
        filepath,
        recordCount: customers.length
      };
    } catch (error) {
      console.error('Failed to export customers to CSV:', error);
      throw error;
    }
  }

  // Export payments to CSV
  async exportPaymentsToCSV(filters = {}) {
    try {
      const payments = await Payment.find({ removed: false, ...filters })
        .populate('invoice')
        .populate('client')
        .populate('createdBy', 'name')
        .sort({ date: -1 });

      const filename = `payments_export_${Date.now()}.csv`;
      const filepath = path.join(this.exportDir, filename);

      const csvWriter = createObjectCsvWriter({
        path: filepath,
        header: [
          { id: 'id', title: 'Payment ID' },
          { id: 'invoiceId', title: 'Invoice ID' },
          { id: 'customer', title: 'Customer' },
          { id: 'amount', title: 'Amount' },
          { id: 'method', title: 'Payment Method' },
          { id: 'reference', title: 'Reference' },
          { id: 'date', title: 'Payment Date' },
          { id: 'createdBy', title: 'Created By' }
        ]
      });

      const records = payments.map(payment => ({
        id: payment._id.toString(),
        invoiceId: payment.invoice?._id?.toString() || 'N/A',
        customer: payment.client?.name || 'N/A',
        amount: payment.amount,
        method: payment.method,
        reference: payment.reference || '',
        date: payment.date.toISOString().split('T')[0],
        createdBy: payment.createdBy?.name || 'N/A'
      }));

      await csvWriter.writeRecords(records);

      return {
        filename,
        filepath,
        recordCount: payments.length
      };
    } catch (error) {
      console.error('Failed to export payments to CSV:', error);
      throw error;
    }
  }

  // Generate PDF report
  async generatePDFReport(reportType, data) {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      let htmlContent = '';
      
      switch (reportType) {
        case 'invoice_summary':
          htmlContent = this.generateInvoiceSummaryHTML(data);
          break;
        case 'customer_report':
          htmlContent = this.generateCustomerReportHTML(data);
          break;
        case 'financial_report':
          htmlContent = this.generateFinancialReportHTML(data);
          break;
        default:
          throw new AppError('Invalid report type', 400);
      }

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const filename = `${reportType}_${Date.now()}.pdf`;
      const filepath = path.join(this.exportDir, filename);
      
      await page.pdf({
        path: filepath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      await browser.close();

      return {
        filename,
        filepath
      };
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      throw error;
    }
  }

  // Create complete data backup
  async createDataBackup() {
    try {
      const timestamp = Date.now();
      const backupDir = path.join(this.exportDir, `backup_${timestamp}`);
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Export all data
      const [invoicesExport, customersExport, paymentsExport] = await Promise.all([
        this.exportInvoicesToExcel(),
        this.exportCustomersToCSV(),
        this.exportPaymentsToCSV()
      ]);

      // Move files to backup directory
      fs.renameSync(invoicesExport.filepath, path.join(backupDir, invoicesExport.filename));
      fs.renameSync(customersExport.filepath, path.join(backupDir, customersExport.filename));
      fs.renameSync(paymentsExport.filepath, path.join(backupDir, paymentsExport.filename));

      // Create backup info file
      const backupInfo = {
        timestamp: new Date().toISOString(),
        files: [
          { name: invoicesExport.filename, type: 'invoices', records: invoicesExport.recordCount },
          { name: customersExport.filename, type: 'customers', records: customersExport.recordCount },
          { name: paymentsExport.filename, type: 'payments', records: paymentsExport.recordCount }
        ]
      };

      fs.writeFileSync(
        path.join(backupDir, 'backup_info.json'),
        JSON.stringify(backupInfo, null, 2)
      );

      // Create ZIP archive
      const zipFilename = `backup_${timestamp}.zip`;
      const zipFilepath = path.join(this.exportDir, zipFilename);
      
      const output = fs.createWriteStream(zipFilepath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          // Clean up temporary directory
          fs.rmSync(backupDir, { recursive: true, force: true });
          
          resolve({
            filename: zipFilename,
            filepath: zipFilepath,
            size: archive.pointer(),
            files: backupInfo.files
          });
        });

        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(backupDir, false);
        archive.finalize();
      });
    } catch (error) {
      console.error('Failed to create data backup:', error);
      throw error;
    }
  }

  // Helper method to generate HTML for reports
  generateInvoiceSummaryHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice Summary Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; background-color: #e8f4fd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice Summary Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="summary">
          <h3>Summary Statistics</h3>
          <p>Total Invoices: ${data.totalInvoices || 0}</p>
          <p>Total Amount: ${data.totalAmount || 0}</p>
          <p>Paid Invoices: ${data.paidInvoices || 0}</p>
          <p>Overdue Invoices: ${data.overdueInvoices || 0}</p>
        </div>
      </body>
      </html>
    `;
  }

  generateCustomerReportHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customer Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Customer Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="summary">
          <h3>Customer Statistics</h3>
          <p>Total Customers: ${data.totalCustomers || 0}</p>
          <p>Active Customers: ${data.activeCustomers || 0}</p>
        </div>
      </body>
      </html>
    `;
  }

  generateFinancialReportHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Financial Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Financial Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="summary">
          <h3>Financial Summary</h3>
          <p>Total Revenue: ${data.totalRevenue || 0}</p>
          <p>Outstanding Amount: ${data.outstandingAmount || 0}</p>
        </div>
      </body>
      </html>
    `;
  }

  // Clean up old export files
  async cleanupOldExports(daysOld = 7) {
    try {
      const files = fs.readdirSync(this.exportDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      let deletedCount = 0;

      files.forEach(file => {
        const filepath = path.join(this.exportDir, file);
        const stats = fs.statSync(filepath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filepath);
          deletedCount++;
        }
      });

      return { deletedCount };
    } catch (error) {
      console.error('Failed to cleanup old exports:', error);
      throw error;
    }
  }
}

export default new ExportService();
