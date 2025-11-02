import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "./AppError.js";

// Create transporter
const createTransporter = () => {
  // For development, use Ethereal Email (fake SMTP service)
  if (env.nodeEnv === "development") {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass"
      }
    });
  }

  // For production, use real SMTP settings
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

// Email templates
const emailTemplates = {
  invoiceCreated: (invoice, customer) => ({
    subject: `New Invoice #${invoice._id} - ${invoice.total} ${invoice.currency}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Invoice Created</h2>
        <p>Dear ${customer.name},</p>
        <p>A new invoice has been created for your account:</p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Invoice Details</h3>
          <p><strong>Invoice ID:</strong> ${invoice._id}</p>
          <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.expiredDate).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> ${invoice.total} ${invoice.currency}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
        </div>

        <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4>Items:</h4>
          ${invoice.items.map(item => `
            <p>${item.itemName} - Qty: ${item.quantity} × ${item.price} ${invoice.currency}</p>
          `).join('')}
        </div>

        <p>Please review the invoice and make payment by the due date.</p>
        <p>Thank you for your business!</p>

        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  paymentReceived: (payment, invoice, customer) => ({
    subject: `Payment Received - Invoice #${invoice._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Payment Received</h2>
        <p>Dear ${customer.name},</p>
        <p>We have received your payment for Invoice #${invoice._id}.</p>

        <div style="background: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Payment Details</h3>
          <p><strong>Payment Amount:</strong> ${payment.amount} ${invoice.currency}</p>
          <p><strong>Payment Method:</strong> ${payment.method}</p>
          <p><strong>Payment Date:</strong> ${new Date(payment.date).toLocaleDateString()}</p>
          <p><strong>Reference:</strong> ${payment.reference || 'N/A'}</p>
        </div>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4>Invoice Summary</h4>
          <p><strong>Invoice Total:</strong> ${invoice.total} ${invoice.currency}</p>
          <p><strong>Amount Paid:</strong> ${invoice.credit} ${invoice.currency}</p>
          <p><strong>Balance:</strong> ${invoice.total - invoice.credit} ${invoice.currency}</p>
          <p><strong>Status:</strong> ${invoice.paymentStatus}</p>
        </div>

        <p>Thank you for your payment!</p>

        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  invoiceOverdue: (invoice, customer, daysPastDue) => ({
    subject: `⚠️ Overdue Invoice #${invoice._id} - ${daysPastDue} days past due`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Invoice Overdue Notice</h2>
        <p>Dear ${customer.name},</p>
        <p>This is a reminder that your invoice is now <strong>${daysPastDue} days past due</strong>.</p>

        <div style="background: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3>Overdue Invoice Details</h3>
          <p><strong>Invoice ID:</strong> ${invoice._id}</p>
          <p><strong>Original Due Date:</strong> ${new Date(invoice.expiredDate).toLocaleDateString()}</p>
          <p><strong>Amount Due:</strong> ${invoice.total - invoice.credit} ${invoice.currency}</p>
          <p><strong>Days Overdue:</strong> ${daysPastDue}</p>
        </div>

        <p>Please arrange payment as soon as possible to avoid any service interruption.</p>
        <p>If you have already made payment, please disregard this notice.</p>

        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Need help?</strong> Contact our billing department if you have any questions about this invoice.</p>
        </div>

        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }),

  paymentReminder: (invoice, customer, daysUntilDue) => ({
    subject: `Payment Reminder - Invoice #${invoice._id} due in ${daysUntilDue} days`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ffc107;">Payment Reminder</h2>
        <p>Dear ${customer.name},</p>
        <p>This is a friendly reminder that your invoice payment is due in <strong>${daysUntilDue} days</strong>.</p>

        <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Invoice Details</h3>
          <p><strong>Invoice ID:</strong> ${invoice._id}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.expiredDate).toLocaleDateString()}</p>
          <p><strong>Amount Due:</strong> ${invoice.total - invoice.credit} ${invoice.currency}</p>
        </div>

        <p>Please ensure payment is made by the due date to avoid any late fees.</p>
        <p>Thank you for your prompt attention to this matter.</p>

        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](data.invoice, data.customer, data.extra);

    const mailOptions = {
      from: process.env.SMTP_FROM || '"ERP System" <noreply@erpsystem.com>',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);

    if (env.nodeEnv === "development") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
    }

    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new AppError("Failed to send email", 500);
  }
};

// Specific email functions
export const sendInvoiceCreatedEmail = async (invoice, customer) => {
  return sendEmail(customer.email, 'invoiceCreated', { invoice, customer });
};

export const sendPaymentReceivedEmail = async (payment, invoice, customer) => {
  return sendEmail(customer.email, 'paymentReceived', { payment, invoice, customer });
};

export const sendInvoiceOverdueEmail = async (invoice, customer) => {
  const daysPastDue = Math.floor((new Date() - new Date(invoice.expiredDate)) / (1000 * 60 * 60 * 24));
  return sendEmail(customer.email, 'invoiceOverdue', { invoice, customer, extra: daysPastDue });
};

export const sendPaymentReminderEmail = async (invoice, customer) => {
  const daysUntilDue = Math.floor((new Date(invoice.expiredDate) - new Date()) / (1000 * 60 * 60 * 24));
  return sendEmail(customer.email, 'paymentReminder', { invoice, customer, extra: daysUntilDue });
};

export default {
  sendEmail,
  sendInvoiceCreatedEmail,
  sendPaymentReceivedEmail,
  sendInvoiceOverdueEmail,
  sendPaymentReminderEmail
};