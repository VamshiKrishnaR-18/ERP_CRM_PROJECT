import Payment from "./payment.model.js";
import { AppError } from "../../utils/AppError.js";
import Invoice from "../invoices/invoice.model.js";
import notificationService from "../../services/notificationService.js";

export const createPayment = async (data) => {
  const { invoiceId, amount, method, reference, createdBy } = data;

  if (!invoiceId) {
    throw new AppError("Invoice ID is required", 400);
  }

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new AppError("Invoice not found!", 404);
  }

  // Generate a simple incremental payment number
  const lastPayment = await Payment.findOne().sort({ number: -1 }).lean();
  const nextNumber = (lastPayment?.number || 0) + 1;

  const payment = await Payment.create({
    number: nextNumber,
    client: invoice.client?._id || invoice.client,
    invoice: invoiceId,
    amount,
    ref: reference,
    // paymentMode is optional and not wired yet; "method" from the form is not an ObjectId
    createdBy,
  });

  if (!payment) {
    throw new AppError("Payment creation failed!", 400);
  }

  invoice.credit += amount;

  if (invoice.credit >= invoice.total) {
    invoice.paymentStatus = "paid";
  } else if (invoice.credit > 0) {
    invoice.paymentStatus = "partial";
  }

  // Link payment back to invoice for history / notifications
  if (!Array.isArray(invoice.payment)) {
    invoice.payment = [];
  }
  invoice.payment.push(payment._id);

  await invoice.save();

  // Send payment received notification (async, don't wait for it)
  try {
    await notificationService.notifyPaymentReceived(payment._id, invoiceId);
  } catch (error) {
    console.error("Failed to send payment received email:", error);
    // Don't throw error, just log it
  }

  return payment;
};

export const getAllPayments = async (filter = {}) => {
  return Payment.find(filter)
    .populate("invoice")
    .populate("client")
    .populate("createdBy");
};

export const getPaymentById = async (id) => {
  return Payment.findById(id)
    .populate("invoice")
    .populate("client")
    .populate("createdBy");
};

export const updatePayment = async (id, data) => {
  return Payment.findByIdAndUpdate(id, data, { new: true });
};

export const deletePayment = async (id) => {
  return Payment.findByIdAndDelete(id);
};

export const getPaymentHistory = async (invoiceId) => {
  return (await Payment.find({ invoice: invoiceId }))
    .sort({ createdAt: -1 })
    .populate("createdBy");
};
