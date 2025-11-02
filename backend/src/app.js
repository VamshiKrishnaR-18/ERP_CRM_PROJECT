import express from "express";
import {notFound, globalErrorHandler} from './middleware/errorHandler.js';
import userRoutes from './modules/users/user.routes.js';
import customerRoutes from './modules/customers/customer.routes.js';
import invoiceRoutes from './modules/invoices/invoice.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import exportRoutes from './modules/exports/export.routes.js';
import dotenv from "dotenv";
import { corsMidlleware } from "./middleware/cors.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(corsMidlleware);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use("/api", apiLimiter);


app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/notifications', notificationRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/exports', exportRoutes);

app.use(notFound);
app.use(globalErrorHandler);
export default app;

