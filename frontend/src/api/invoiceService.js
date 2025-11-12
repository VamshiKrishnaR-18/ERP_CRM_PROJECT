import axiosClient from './axiosClient';

export const invoiceService = {
  // Create a new invoice
  createInvoice: async (invoiceData) => {
    const response = await axiosClient.post('/invoices/createInvoice', invoiceData);
    return response.data;
  },

  // Get all invoices
  getAllInvoices: async (params = {}) => {
    const response = await axiosClient.get('/invoices/getAllInvoices', { params });
    return response.data;
  },

  // Get invoice by ID
  getInvoiceById: async (invoiceId) => {
    const response = await axiosClient.get(`/invoices/getInvoice/${invoiceId}`);
    return response.data;
  },

  // Update invoice
  updateInvoice: async (invoiceId, invoiceData) => {
    const response = await axiosClient.patch(`/invoices/updateInvoice/${invoiceId}`, invoiceData);
    return response.data;
  },

  // Delete invoice (soft delete)
  deleteInvoice: async (invoiceId) => {
    const response = await axiosClient.delete(`/invoices/deleteInvoice/${invoiceId}`);
    return response.data;
  },

  // Get invoice summary
  getInvoiceSummary: async () => {
    const response = await axiosClient.get('/invoices/getInvoiceSummary');
    return response.data;
  },

  // Analyze client invoices
  analyzeClientInvoices: async (clientId) => {
    const response = await axiosClient.get(`/invoices/analyzeClientInvoices/${clientId}`);
    return response.data;
  }
};

export default invoiceService;

