import Payment from "./payment.model.js";
import { AppError } from "../../utils/AppError.js";
import Invoice from "../invoices/invoice.model.js";
import notificationService from "../../services/notificationService.js";

export const createPayment = async (data, userId) => {
  const { invoiceId, amount, method, reference } = data;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new AppError("Invoice not found!", 404);
  }

  const payment = await Payment.create({
    invoice: invoiceId,
    amount,
    method,
    reference,
    createdBy: userId,
  });

  if (!payment) {
    throw new AppError("Payment creation failed!", 400);
  }

  invoice.credit += amount;

  if (invoice.credit >= invoice.total) {
    invoice.paymentStatus = "paid";
  } else if (invoice.credit > 0) {
    invoice.paymentStatus = "partially";
  }

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
