import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/AppError.js";

// Create upload directories
const createUploadDirs = () => {
  const dirs = [
    "./uploads/invoices",
    "./uploads/attachments",
    "./uploads/exports",
    "./uploads/temp"
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration for invoice attachments
const invoiceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/invoices"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `invoice-${req.params.id || 'temp'}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for general attachments
const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/attachments"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `attachment-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only images, PDFs, and office documents are allowed.', 400), false);
  }
};

// Upload configurations
export const uploadInvoiceAttachment = multer({
  storage: invoiceStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files at once
  }
});

export const uploadAttachment = multer({
  storage: attachmentStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files at once
  }
});

// Single file upload
export const uploadSingle = uploadInvoiceAttachment.single('attachment');

// Multiple files upload
export const uploadMultiple = uploadInvoiceAttachment.array('attachments', 5);

export default uploadInvoiceAttachment;

