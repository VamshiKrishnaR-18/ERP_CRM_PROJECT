import * as paymentService from "./payment.service.js";
import apiResponse from "../../utils/apiResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";


export const createPayment = catchAsync(async (req, res, next) => {
  const payment = await paymentService.createPayment({
    ...req.body,
    createdBy: req.user?.id,
  });
  return apiResponse.success(
    res,
    payment,
    "Payment created successfully!",
    201
  );
});

export const getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await paymentService.getAllPayments();
  return apiResponse.success(
    res,
    payments,
    "Payments fetched successfully!",
    200
  );
});

export const getPaymentById = catchAsync(async (req, res, next) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  return apiResponse.success(
    res,
    payment,
    "Payment fetched successfully!",
    200
  );
});

export const updatePayment = catchAsync(async (req, res, next) => {
  const payment = await paymentService.updatePayment(req.params.id, req.body);
  return apiResponse.success(
    res,
    payment,
    "Payment updated successfully!",
    200
  );
});

export const deletePayment = catchAsync(async (req, res, next) => {
  const payment = await paymentService.deletePayment(req.params.id);
  return apiResponse.success(
    res,
    payment,
    "Payment deleted successfully!",
    200
  );
});

export const getPaymentHistory = catchAsync(async (req, res, next) => {
  const payment = await paymentService.getPaymentHistory(req.params.invoiceId);
  return apiResponse.success(
    res,
    payment,
    "Payment history fetched successfully!",
    200
  );
});
