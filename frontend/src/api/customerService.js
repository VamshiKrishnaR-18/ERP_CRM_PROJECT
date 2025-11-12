import axiosClient from './axiosClient';

export const customerService = {
  // Create a new customer
  createCustomer: async (customerData) => {
    const response = await axiosClient.post('/customers/createCustomer', customerData);
    return response.data;
  },

  // Get all customers
  getAllCustomers: async () => {
    const response = await axiosClient.get('/customers/getCustomers');
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (customerId) => {
    const response = await axiosClient.get(`/customers/getCustomer/${customerId}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (customerId, customerData) => {
    const response = await axiosClient.patch(`/customers/updateCustomer/${customerId}`, customerData);
    return response.data;
  },

  // Delete customer (soft delete)
  deleteCustomer: async (customerId) => {
    const response = await axiosClient.delete(`/customers/deleteCustomer/${customerId}`);
    return response.data;
  },

  // Disable customer
  disableCustomer: async (customerId) => {
    const response = await axiosClient.patch(`/customers/disableCustomer/${customerId}`);
    return response.data;
  },

  // Enable customer
  enableCustomer: async (customerId) => {
    const response = await axiosClient.patch(`/customers/enableCustomer/${customerId}`);
    return response.data;
  }
};

export default customerService;

