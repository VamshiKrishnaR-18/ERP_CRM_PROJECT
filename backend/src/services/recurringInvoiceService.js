import cron from "node-cron";
import Invoice from "../modules/invoices/invoice.model.js";
import { AppError } from "../utils/AppError.js";
import { calculateTotals } from "../modules/invoices/invoice.helper.js";
import { generateAIInsight } from "../utils/openai.js";
import notificationService from "./notificationService.js";

class RecurringInvoiceService {
  constructor() {
    this.jobs = new Map();
    this.initializeScheduledJobs();
  }

  // Initialize all scheduled jobs
  initializeScheduledJobs() {
    // Daily check for recurring invoices at 9 AM
    cron.schedule('0 9 * * *', () => {
      console.log('Running daily recurring invoice check...');
      this.processRecurringInvoices();
    });

    // Weekly check for overdue notifications on Mondays at 10 AM
    cron.schedule('0 10 * * 1', () => {
      console.log('Running weekly overdue notification check...');
      notificationService.notifyOverdueInvoices();
    });

    // Payment reminders every Tuesday and Thursday at 2 PM
    cron.schedule('0 14 * * 2,4', () => {
      console.log('Running payment reminder check...');
      notificationService.notifyPaymentReminders(3);
    });

    console.log('Recurring invoice automation initialized');
  }

  // Process all recurring invoices
  async processRecurringInvoices() {
    try {
      const recurringInvoices = await Invoice.find({
        removed: false,
        recurring: { $exists: true, $ne: null },
        status: { $ne: 'cancelled' }
      }).populate('client');

      const results = [];

      for (const invoice of recurringInvoices) {
        try {
          const shouldGenerate = this.shouldGenerateRecurringInvoice(invoice);
          
          if (shouldGenerate) {
            const newInvoice = await this.generateRecurringInvoice(invoice);
            results.push({
              originalInvoiceId: invoice._id,
              newInvoiceId: newInvoice._id,
              success: true
            });
            console.log(`Generated recurring invoice ${newInvoice._id} from ${invoice._id}`);
          }
        } catch (error) {
          console.error(`Failed to process recurring invoice ${invoice._id}:`, error);
          results.push({
            originalInvoiceId: invoice._id,
            success: false,
            error: error.message
          });
        }
      }

      return {
        success: true,
        message: `Processed ${recurringInvoices.length} recurring invoices`,
        results
      };
    } catch (error) {
      console.error('Failed to process recurring invoices:', error);
      throw error;
    }
  }

  // Check if a recurring invoice should be generated
  shouldGenerateRecurringInvoice(invoice) {
    const now = new Date();
    const lastGenerated = invoice.lastRecurringGenerated || invoice.created;
    const daysSinceLastGenerated = Math.floor((now - lastGenerated) / (1000 * 60 * 60 * 24));

    switch (invoice.recurring) {
      case 'daily':
        return daysSinceLastGenerated >= 1;
      case 'weekly':
        return daysSinceLastGenerated >= 7;
      case 'monthly':
        return daysSinceLastGenerated >= 30;
      case 'yearly':
        return daysSinceLastGenerated >= 365;
      default:
        return false;
    }
  }

  // Generate a new invoice from a recurring template
  async generateRecurringInvoice(templateInvoice) {
    try {
      const now = new Date();
      const dueDate = this.calculateNextDueDate(now, templateInvoice.recurring);

      // Calculate totals
      const { subTotal, taxTotal, total } = calculateTotals(
        templateInvoice.items,
        templateInvoice.taxRate,
        templateInvoice.discount,
        0 // No credit for new invoices
      );

      // Create new invoice data
      const newInvoiceData = {
        year: now.getFullYear(),
        date: now,
        expiredDate: dueDate,
        client: templateInvoice.client._id,
        items: templateInvoice.items.map(item => ({
          itemName: item.itemName,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          taxRate: item.taxRate || 0
        })),
        currency: templateInvoice.currency,
        taxRate: templateInvoice.taxRate,
        discount: templateInvoice.discount,
        credit: 0,
        subTotal,
        taxTotal,
        total,
        paymentStatus: 'unpaid',
        status: 'sent',
        notes: `Recurring invoice generated from template ${templateInvoice._id}`,
        recurring: templateInvoice.recurring,
        recurringTemplate: templateInvoice._id,
        createdBy: templateInvoice.createdBy
      };

      // Create the new invoice
      const newInvoice = await Invoice.create(newInvoiceData);

      // Update the template invoice's last generated date
      await Invoice.findByIdAndUpdate(templateInvoice._id, {
        lastRecurringGenerated: now
      });

      // Generate AI insights for the new invoice
      try {
        const aiInsights = await generateAIInsight(
          `A recurring invoice was generated with total ${total}, recurring frequency: ${templateInvoice.recurring}. 
          Provide insights on the recurring billing pattern and customer relationship.`
        );
        
        // You could store AI insights in a separate collection or add to invoice
        console.log(`AI Insights for recurring invoice ${newInvoice._id}:`, aiInsights);
      } catch (aiError) {
        console.error('Failed to generate AI insights for recurring invoice:', aiError);
      }

      // Send notification email
      try {
        await notificationService.notifyInvoiceCreated(newInvoice._id);
      } catch (emailError) {
        console.error('Failed to send recurring invoice email:', emailError);
      }

      return newInvoice;
    } catch (error) {
      console.error('Failed to generate recurring invoice:', error);
      throw error;
    }
  }

  // Calculate next due date based on recurring frequency
  calculateNextDueDate(startDate, frequency) {
    const dueDate = new Date(startDate);
    
    switch (frequency) {
      case 'daily':
        dueDate.setDate(dueDate.getDate() + 1);
        break;
      case 'weekly':
        dueDate.setDate(dueDate.getDate() + 7);
        break;
      case 'monthly':
        dueDate.setMonth(dueDate.getMonth() + 1);
        break;
      case 'yearly':
        dueDate.setFullYear(dueDate.getFullYear() + 1);
        break;
      default:
        dueDate.setDate(dueDate.getDate() + 30); // Default to monthly
    }
    
    return dueDate;
  }

  // Create a recurring invoice template
  async createRecurringTemplate(invoiceData, userId) {
    try {
      if (!invoiceData.recurring) {
        throw new AppError("Recurring frequency is required", 400);
      }

      const { subTotal, taxTotal, total } = calculateTotals(
        invoiceData.items,
        invoiceData.taxRate,
        invoiceData.discount,
        invoiceData.credit
      );

      const recurringInvoice = await Invoice.create({
        ...invoiceData,
        subTotal,
        taxTotal,
        total,
        paymentStatus: 'unpaid',
        status: 'template', // Mark as template
        isRecurringTemplate: true,
        createdBy: userId,
        lastRecurringGenerated: null
      });

      return recurringInvoice;
    } catch (error) {
      console.error('Failed to create recurring template:', error);
      throw error;
    }
  }

  // Get all recurring templates
  async getRecurringTemplates(userId) {
    try {
      const templates = await Invoice.find({
        removed: false,
        isRecurringTemplate: true,
        createdBy: userId
      }).populate('client');

      return templates;
    } catch (error) {
      console.error('Failed to get recurring templates:', error);
      throw error;
    }
  }

  // Update recurring template
  async updateRecurringTemplate(templateId, updateData, userId) {
    try {
      const template = await Invoice.findOneAndUpdate(
        { 
          _id: templateId, 
          isRecurringTemplate: true,
          createdBy: userId 
        },
        {
          ...updateData,
          updatedBy: userId,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!template) {
        throw new AppError("Recurring template not found", 404);
      }

      return template;
    } catch (error) {
      console.error('Failed to update recurring template:', error);
      throw error;
    }
  }

  // Delete recurring template
  async deleteRecurringTemplate(templateId, userId) {
    try {
      const template = await Invoice.findOneAndUpdate(
        { 
          _id: templateId, 
          isRecurringTemplate: true,
          createdBy: userId 
        },
        {
          removed: true,
          updatedBy: userId,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!template) {
        throw new AppError("Recurring template not found", 404);
      }

      return template;
    } catch (error) {
      console.error('Failed to delete recurring template:', error);
      throw error;
    }
  }

  // Manual trigger for recurring invoice generation
  async triggerRecurringInvoice(templateId) {
    try {
      const template = await Invoice.findOne({
        _id: templateId,
        isRecurringTemplate: true,
        removed: false
      }).populate('client');

      if (!template) {
        throw new AppError("Recurring template not found", 404);
      }

      const newInvoice = await this.generateRecurringInvoice(template);
      
      return {
        success: true,
        message: "Recurring invoice generated successfully",
        newInvoice
      };
    } catch (error) {
      console.error('Failed to trigger recurring invoice:', error);
      throw error;
    }
  }
}

export default new RecurringInvoiceService();
