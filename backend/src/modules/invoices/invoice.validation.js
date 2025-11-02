// src/modules/invoices/invoice.validation.js
import Joi from "joi";

const item = Joi.object({
  product: Joi.string().hex().length(24).optional(),
  itemName: Joi.string().trim().required(),
  description: Joi.string().allow(""),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).default(0),
  taxRate: Joi.number().min(0).max(100).default(0),
});

export const createInvoiceSchema = Joi.object({
  body: Joi.object({
    year: Joi.number().required(),
    date: Joi.date().required(),
    expiredDate: Joi.date().required(),
    client: Joi.string().hex().length(24).required(),
    items: Joi.array().items(item).min(1).required(),
    currency: Joi.string().uppercase().length(3).required(),
    discount: Joi.number().min(0).default(0),
    credit: Joi.number().min(0).default(0),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

export const getInvoicesSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid("draft","pending","sent","refunded","cancelled","on hold").optional(),
    client: Joi.string().hex().length(24).optional(),
    paymentStatus: Joi.string().valid("paid","unpaid","partial").optional(),
    search: Joi.string().optional(),
  }),
  params: Joi.object({}),
  body: Joi.object({}),
});