import * as customerService from "./customer.server.js";
import apiResponse from "../../utils/apiResponse.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const createCustomer = catchAsync(async (req, res, next) => {

    const userId = req.user?.id;

    const customer = await customerService.createCustomer(req.body, userId);

    return apiResponse.success(res, customer, "Customer created successfully!", 201);

});


export const getAllCustomers =  catchAsync(async (req, res, next)=>{
    const customers = await customerService.getAllCustomers();
    return apiResponse.success(res, customers, "Customers fetched successfully!", 200);
})

export const getCustomerById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const customer = await customerService.getCustomerById(id);
    return apiResponse.success(res, customer, "Customer fetched successfully!", 200);
});

export const updateCustomer =  catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const id = req.params.id;
    const customer = await customerService.updateCustomer(id, req.body, userId);
    return apiResponse.success(res, customer, "Customer updated successfully!", 200);
});

export const softDeleteCustomer = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const id = req.params.id;
    const customer = await customerService.softDeleteCustomer(id, userId);
    return apiResponse.success(res, customer, "Customer deleted successfully!", 200);
});

export const disableCustomer = catchAsync(async ( req, res, next)=>{
    const userId = req.user?.id;
    const id = req.params.id;
    const customer = await customerService.disableCustomer(id, userId);
    return apiResponse.success(res, customer, "Customer disabled successfully!", 200);
})


export const enableCustomer = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const id = req.params.id;
    const customer = await customerService.enableCustomer(id, userId);
    return apiResponse.success(res, customer, "Customer enabled successfully!", 200);
});
