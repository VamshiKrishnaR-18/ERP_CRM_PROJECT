import axiosClient from './axiosClient';

export const exportService = {
  // Export invoices to Excel
  exportInvoicesToExcel: async () => {
    const response = await axiosClient.get('/exports/invoices/excel', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export customers to CSV
  exportCustomersToCSV: async () => {
    const response = await axiosClient.get('/exports/customers/csv', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export payments to CSV
  exportPaymentsToCSV: async () => {
    const response = await axiosClient.get('/exports/payments/csv', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Generic export data
  exportData: async (type, format) => {
    const response = await axiosClient.get(`/exports/${type}/${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Generate PDF report
  generatePDFReport: async (reportType, reportData) => {
    const response = await axiosClient.post(`/exports/reports/${reportType}/pdf`, reportData, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Create data backup
  createDataBackup: async () => {
    const response = await axiosClient.post('/exports/backup');
    return response.data;
  },

  // Helper function to download blob
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default exportService;

