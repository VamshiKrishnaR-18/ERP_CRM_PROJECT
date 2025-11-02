import Invoice from "./invoice.model.js";
import Payment from "../payments/payment.model.js";
import { AppError } from "../../utils/AppError.js";
import { calculateTotals } from "./invoice.helper.js";
import { generateAIInsight } from "../../utils/openai.js";
import notificationService from "../../services/notificationService.js";

export const createInvoice = async (data, userId) => {
  if (!data.items || data.items.length === 0) {
    throw new AppError("Items cannot be empty!", 400);
  }

  const { subTotal, taxTotal, total } = calculateTotals(
    data.items,
    data.taxRate,
    data.discount,
    data.credit
  );

  const paymentStatus =
    total <= 0 ? "paid" : data.credit > 0 ? "partially" : "unpaid";

  const invoice = await Invoice.create({
    ...data,
    subTotal,
    taxTotal,
    total,
    paymentStatus,
    createdBy: userId,
  });

  if (!invoice) throw new AppError("Invoice creation failed", 400);

  const aiInsights = await generateAIInsight(
    `An invoice was just created with total ${total}, taxRate ${data.taxRate}, discount ${data.discount}, credit ${data.credit}.
        Provide a short professional insight: is this invoice typical, unusually high/low, or risky? use indian rupee`
  );

  // Send email notification (async, don't wait for it)
  try {
    await notificationService.notifyInvoiceCreated(invoice._id);
  } catch (error) {
    console.error("Failed to send invoice created email:", error);
    // Don't throw error, just log it
  }

  return { invoice, aiInsights };
};

export const updateInvoice = async (id, data, userId) => {
  const existing = await Invoice.findById(id);

  if (!existing) throw new AppError("Invoice not found!", 404);

  const { subTotal, taxTotal, total } = calculateTotals(
    data.items || existing.items,
    data.taxRate ?? existing.taxRate,
    data.discount ?? existing.discount,
    data.credit ?? existing.credit
  );

  const paymentStatus =
    total <= 0
      ? "paid"
      : (data.credit ?? existing.credit) > 0
      ? "partially"
      : "unpaid";

  const invoice = await Invoice.findByIdAndUpdate(
    id,
    {
      ...data,
      subTotal,
      taxTotal,
      total,
      paymentStatus,
      updatedBy: userId,
      updatedAt: Date.now(),
    },
    { new: true }
  );

  const aiInsights = await generateAIInsight(
    `An invoice was just updated. Old total: ${existing.total}, new total: ${total}.
      Highlight if this change is significant, and suggest if the client may need follow-up`
  );

  return { invoice, aiInsights };
};

export const softDeleteInvoice = async (id, userId) => {
  const invoice = await Invoice.findByIdAndUpdate(
    id,
    {
      removed: true,
      updatedBy: userId,
      updatedAt: Date.now(),
    },
    { new: true }
  );

  if (!invoice) throw new AppError("Invoice not found!", 404);

  await Payment.updateMany({ invoice: invoice._id }, { removed: true });

  return invoice;
};

export const getInvoiceSummary = async () => {
  const [totalInvoices, totalAmountAgg, overdueCount] = await Promise.all([
    Invoice.countDocuments({ removed: false }),
    Invoice.aggregate([
      { $match: { removed: false } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Invoice.countDocuments({
      removed: false,
      expiredDate: { $lt: new Date() },
      paymentStatus: { $ne: "paid" },
    }),
  ]);

  const totalAmount = totalAmountAgg[0]?.total || 0;
  const overduePercentage =
    totalInvoices > 0 ? ((overdueCount / totalInvoices) * 100).toFixed(2) : 0;

  const stats = { totalInvoices, totalAmount, overdueCount, overduePercentage };

  const aiInsights = await generateAIInsight(`
    Invoice Summary:
    - Total invoices: ${totalInvoices}
    - Total billed amount: ₹${totalAmount.toFixed(2)}
    - Overdue invoices: ${overdueCount} (${overduePercentage}%)

    Write a concise financial summary (2-3 lines) highlighting risks and opportunities.
    `);

  return { ...stats, aiInsights };
};

export const analyzeClientInvoices = async (clientId) => {
  const invoices = await Invoice.find({ client: clientId, removed: false });

  if (!invoices || invoices.length === 0)
    throw new AppError("No invoices found for this client!", 404);

  const stats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    overdue: invoices.filter(
      (inv) => inv.expiredDate < Date.now() && inv.paymentStatus !== "paid"
    ).length,
    averageInvoice:
      invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length,
  };

  const aiInsights = await generateAIInsight(
    `Analyze this client's invoice history: ${JSON.stringify(stats)}. 
    Provide insights on payment behavior, risks, and suggestions for improving cash flow.`
  );

  return { stats, aiInsights };
};

export const addAttachment = async (invoiceId, file, description, userId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError("Invoice not found!", 404);

  const attachment = {
    id: file.filename,
    name: file.originalname,
    path: file.path,
    description: description || "",
    isPublic: false,
    uploadedBy: userId,
    uploadedAt: new Date(),
    size: file.size,
    mimetype: file.mimetype
  };

  invoice.files.push(attachment);
  invoice.updatedBy = userId;
  invoice.updatedAt = new Date();
  await invoice.save();

  return attachment;
};

export const addMultipleAttachments = async (invoiceId, files, descriptions, userId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError("Invoice not found!", 404);

  const attachments = files.map((file, index) => ({
    id: file.filename,
    name: file.originalname,
    path: file.path,
    description: descriptions?.[index] || "",
    isPublic: false,
    uploadedBy: userId,
    uploadedAt: new Date(),
    size: file.size,
    mimetype: file.mimetype
  }));

  invoice.files.push(...attachments);
  invoice.updatedBy = userId;
  invoice.updatedAt = new Date();
  await invoice.save();

  return attachments;
};

export const removeAttachment = async (invoiceId, attachmentId, userId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError("Invoice not found!", 404);

  const attachmentIndex = invoice.files.findIndex(file => file.id === attachmentId);
  if (attachmentIndex === -1) throw new AppError("Attachment not found!", 404);

  // Remove file from filesystem
  const fs = await import('fs');
  const attachment = invoice.files[attachmentIndex];
  if (fs.existsSync(attachment.path)) {
    fs.unlinkSync(attachment.path);
  }

  invoice.files.splice(attachmentIndex, 1);
  invoice.updatedBy = userId;
  invoice.updatedAt = new Date();
  await invoice.save();

  return { message: "Attachment removed successfully" };
};

export const listAttachments = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError("Invoice not found!", 404);

  return invoice.files;
};

export const downloadAttachment = async (invoiceId, attachmentId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError("Invoice not found!", 404);

  const attachment = invoice.files.find(file => file.id === attachmentId);
  if (!attachment) throw new AppError("Attachment not found!", 404);

  const fs = await import('fs');
  if (!fs.existsSync(attachment.path)) {
    throw new AppError("File not found on server!", 404);
  }

  return attachment;
};

export const deleteAttachment = async (invoiceId, fileId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError("Invoice not found!", 404);

  invoice.files = invoice.files.filter((file) => file.id !== fileId);
  await invoice.save();

  return true;
};
