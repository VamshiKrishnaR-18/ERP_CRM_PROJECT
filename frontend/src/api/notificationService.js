import axiosClient from './axiosClient';

export const notificationService = {
  // Send overdue notifications
  sendOverdueNotifications: async () => {
    const response = await axiosClient.post('/notifications/overdue');
    return response.data;
  },

  // Send payment reminders
  sendPaymentReminders: async () => {
    const response = await axiosClient.post('/notifications/reminders');
    return response.data;
  },

  // Send bulk notifications
  sendBulkNotifications: async (notificationData) => {
    const response = await axiosClient.post('/notifications/bulk', notificationData);
    return response.data;
  },

  // Send invoice notification
  sendInvoiceNotification: async (invoiceId) => {
    const response = await axiosClient.post(`/notifications/invoice/${invoiceId}`);
    return response.data;
  },

  // Send payment notification
  sendPaymentNotification: async (paymentId, invoiceId) => {
    const response = await axiosClient.post(`/notifications/payment/${paymentId}/${invoiceId}`);
    return response.data;
  }
};

export default notificationService;

