import axiosClient from './axiosClient';

export const analyticsService = {
  // Get dashboard summary
  getDashboardSummary: async () => {
    const response = await axiosClient.get('/analytics/dashboard');
    return response.data;
  },

  // Get business intelligence report
  getBusinessIntelligenceReport: async () => {
    const response = await axiosClient.get('/analytics/business-intelligence');
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async () => {
    const response = await axiosClient.get('/analytics/revenue');
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async () => {
    const response = await axiosClient.get('/analytics/customers');
    return response.data;
  },

  // Get payment analytics
  getPaymentAnalytics: async () => {
    const response = await axiosClient.get('/analytics/payments');
    return response.data;
  },

  // Get invoice status analytics
  getInvoiceStatusAnalytics: async () => {
    const response = await axiosClient.get('/analytics/invoice-status');
    return response.data;
  }
};

export default analyticsService;

