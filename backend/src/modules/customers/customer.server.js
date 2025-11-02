import Customer from "./customer.model.js";
import { AppError } from "../../utils/AppError.js";

export const createCustomer = async (data, userId) => {
  const alreadyExists = await Customer.findOne({ email: data.email });
  if (alreadyExists) {
    throw new AppError("Customer already exists!", 400);
  }

  const customer = await Customer.create({ ...data, createdBy: userId });
  if (!customer) {
    throw new AppError("Customer creation failed!", 400);
  }
  return customer;
};

export const getAllCustomers = async () => {
  const customers = await Customer.find({ removed: false });
  if (customers.length === 0) {
    throw new AppError("No customers found!", 404);
  }
  return customers;
};

export const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) {
    throw new AppError("Customer not found!", 404);
  }
  return customer;
};

export const updateCustomer = async (id, data, userId) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId, updatedAt: Date.now() },
    { new: true}
  );
  if (!customer) {
    throw new AppError("Customer not found!", 404);
  }
  return customer;
};

export const softDeleteCustomer = async (id, userId) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { removed: true,enabled:false, updatedBy: userId, updatedAt: Date.now() },
    { new: true }
  );
  if (!customer) {
    throw new AppError("Customer not found!", 404);
  }
  return customer;
};

export const disableCustomer = async (id, userId) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { enabled: false, updatedBy: userId, updatedAt: Date.now() },
    { new: true }
  );
  if (!customer) {
    throw new AppError("Customer not found!", 404);
  }
  return customer;
};

export const enableCustomer = async (id, userId) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { enabled: true,removed:false, updatedBy: userId, updatedAt: Date.now() },
    { new: true }
  );
  if (!customer) {
    throw new AppError("Customer not found!", 404);
  }
  return customer;
};