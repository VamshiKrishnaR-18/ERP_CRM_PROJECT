import axiosClient from './axiosClient';

export const paymentService = {
  // Create a new payment
  createPayment: async (paymentData) => {
    const response = await axiosClient.post('/payments/createPayment', paymentData);
    return response.data;
  },

  // Get all payments
  getAllPayments: async () => {
    const response = await axiosClient.get('/payments/getAllPayments');
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await axiosClient.get(`/payments/getPayment/${paymentId}`);
    return response.data;
  },

  // Update payment
  updatePayment: async (paymentId, paymentData) => {
    const response = await axiosClient.patch(`/payments/updatePayment/${paymentId}`, paymentData);
    return response.data;
  },

  // Delete payment
  deletePayment: async (paymentId) => {
    const response = await axiosClient.delete(`/payments/deletePayment/${paymentId}`);
    return response.data;
  },

  // Get payment history for an invoice
  getPaymentHistory: async (invoiceId) => {
    const response = await axiosClient.get(`/payments/getPaymentHistory/${invoiceId}`);
    return response.data;
  }
};

export default paymentService;

