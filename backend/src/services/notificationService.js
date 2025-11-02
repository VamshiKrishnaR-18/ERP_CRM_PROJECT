import * as mailer from "../utils/mailer.js";
import Customer from "../modules/customers/customer.model.js";
import Invoice from "../modules/invoices/invoice.model.js";
import { AppError } from "../utils/AppError.js";

// Notification service for handling all email notifications
class NotificationService {
  
  // Send invoice created notification
  async notifyInvoiceCreated(invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId).populate('client');
      if (!invoice) throw new AppError("Invoice not found", 404);
      
      const customer = invoice.client;
      if (!customer || !customer.email) {
        console.log("Customer email not found for invoice:", invoiceId);
        return;
      }

      await mailer.sendInvoiceCreatedEmail(invoice, customer);
      console.log(`Invoice created email sent to ${customer.email} for invoice ${invoiceId}`);
      
      return { success: true, message: "Invoice created email sent successfully" };
    } catch (error) {
      console.error("Failed to send invoice created email:", error);
      throw error;
    }
  }

  // Send payment received notification
  async notifyPaymentReceived(paymentId, invoiceId) {
    try {
      const invoice = await Invoice.findById(invoiceId).populate('client');
      if (!invoice) throw new AppError("Invoice not found", 404);

      // Get payment details (assuming payment is embedded or referenced)
      const payment = invoice.payment?.find(p => p._id.toString() === paymentId) || 
                    { amount: invoice.credit, method: 'Unknown', date: new Date() };
      
      const customer = invoice.client;
      if (!customer || !customer.email) {
        console.log("Customer email not found for payment notification:", invoiceId);
        return;
      }

      await mailer.sendPaymentReceivedEmail(payment, invoice, customer);
      console.log(`Payment received email sent to ${customer.email} for invoice ${invoiceId}`);
      
      return { success: true, message: "Payment received email sent successfully" };
    } catch (error) {
      console.error("Failed to send payment received email:", error);
      throw error;
    }
  }

  // Send overdue invoice notifications
  async notifyOverdueInvoices() {
    try {
      const overdueInvoices = await Invoice.find({
        removed: false,
        expiredDate: { $lt: new Date() },
        paymentStatus: { $in: ['unpaid', 'partial'] }
      }).populate('client');

      const results = [];
      
      for (const invoice of overdueInvoices) {
        try {
          const customer = invoice.client;
          if (!customer || !customer.email) {
            console.log("Customer email not found for overdue invoice:", invoice._id);
            continue;
          }

          await mailer.sendInvoiceOverdueEmail(invoice, customer);
          console.log(`Overdue email sent to ${customer.email} for invoice ${invoice._id}`);
          
          results.push({ 
            invoiceId: invoice._id, 
            customerEmail: customer.email, 
            success: true 
          });
        } catch (error) {
          console.error(`Failed to send overdue email for invoice ${invoice._id}:`, error);
          results.push({ 
            invoiceId: invoice._id, 
            success: false, 
            error: error.message 
          });
        }
      }

      return { 
        success: true, 
        message: `Processed ${overdueInvoices.length} overdue invoices`,
        results 
      };
    } catch (error) {
      console.error("Failed to send overdue notifications:", error);
      throw error;
    }
  }

  // Send payment reminder notifications
  async notifyPaymentReminders(daysBefore = 3) {
    try {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + daysBefore);

      const upcomingInvoices = await Invoice.find({
        removed: false,
        expiredDate: { 
          $gte: new Date(),
          $lte: reminderDate 
        },
        paymentStatus: { $in: ['unpaid', 'partial'] }
      }).populate('client');

      const results = [];
      
      for (const invoice of upcomingInvoices) {
        try {
          const customer = invoice.client;
          if (!customer || !customer.email) {
            console.log("Customer email not found for reminder invoice:", invoice._id);
            continue;
          }

          await mailer.sendPaymentReminderEmail(invoice, customer);
          console.log(`Payment reminder sent to ${customer.email} for invoice ${invoice._id}`);
          
          results.push({ 
            invoiceId: invoice._id, 
            customerEmail: customer.email, 
            success: true 
          });
        } catch (error) {
          console.error(`Failed to send reminder email for invoice ${invoice._id}:`, error);
          results.push({ 
            invoiceId: invoice._id, 
            success: false, 
            error: error.message 
          });
        }
      }

      return { 
        success: true, 
        message: `Processed ${upcomingInvoices.length} upcoming invoices`,
        results 
      };
    } catch (error) {
      console.error("Failed to send payment reminders:", error);
      throw error;
    }
  }

  // Send bulk notifications
  async sendBulkNotifications(type, filters = {}) {
    try {
      let results = [];
      
      switch (type) {
        case 'overdue':
          results = await this.notifyOverdueInvoices();
          break;
        case 'reminder':
          results = await this.notifyPaymentReminders(filters.daysBefore || 3);
          break;
        default:
          throw new AppError("Invalid notification type", 400);
      }

      return results;
    } catch (error) {
      console.error("Failed to send bulk notifications:", error);
      throw error;
    }
  }

  // Test email functionality
  async testEmail(email) {
    try {
      const testInvoice = {
        _id: "TEST123",
        date: new Date(),
        expiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        total: 1000,
        credit: 0,
        currency: "INR",
        status: "sent",
        paymentStatus: "unpaid",
        items: [
          { itemName: "Test Item", quantity: 1, price: 1000 }
        ]
      };

      const testCustomer = {
        name: "Test Customer",
        email: email
      };

      await mailer.sendInvoiceCreatedEmail(testInvoice, testCustomer);
      
      return { 
        success: true, 
        message: `Test email sent successfully to ${email}` 
      };
    } catch (error) {
      console.error("Failed to send test email:", error);
      throw error;
    }
  }
}

export default new NotificationService();
