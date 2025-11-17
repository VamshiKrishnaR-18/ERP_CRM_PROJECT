import express from "express";
import {notFound, globalErrorHandler} from './middleware/errorHandler.js';
import userRoutes from './modules/users/user.routes.js';
import customerRoutes from './modules/customers/customer.routes.js';
import invoiceRoutes from './modules/invoices/invoice.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import exportRoutes from './modules/exports/export.routes.js';
import dotenv from "dotenv";
import { corsMidlleware } from "./middleware/cors.js";
import helmet from "helmet";
// import xss from "xss-clean"; // ❌ Removed: Incompatible with Express 5.x (tries to set read-only req.query)
// import mongoSanitize from "express-mongo-sanitize"; // ❌ Removed: Incompatible with Express 5.x (tries to set read-only req.query)
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});





dotenv.config();



const app = express();

// Custom MongoDB injection sanitization middleware (Express 5.x compatible)
const sanitizeNoSQL = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        // Remove keys that start with $ or contain .
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
          console.warn(`⚠️  Removed potentially malicious key: ${key}`);
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  // Don't sanitize req.query as it's read-only in Express 5.x
  // Query params are less risky for NoSQL injection anyway

  next();
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(corsMidlleware);
app.use(helmet()); // ✅ Provides XSS protection via Content-Security-Policy
// app.use(xss()); // ❌ Removed: Incompatible with Express 5.x
// app.use(mongoSanitize()); // ❌ Removed: Incompatible with Express 5.x
app.use(sanitizeNoSQL); // ✅ Custom MongoDB injection prevention (Express 5.x compatible)
app.use("/api", apiLimiter);


app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/exports', exportRoutes);

app.use(notFound);
app.use(globalErrorHandler);
export default app;

