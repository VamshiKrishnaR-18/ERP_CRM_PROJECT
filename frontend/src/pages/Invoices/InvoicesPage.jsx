import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../../api/invoiceService';
import InvoiceForm from './InvoiceForm';
import { Table, Button, Card, Modal, Tag, Space, Spin, Alert } from 'antd';

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getAllInvoices();
      setInvoices(response.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = () => { setSelectedInvoice(null); setIsModalOpen(true); };
  const handleEditInvoice = (invoice) => { setSelectedInvoice(invoice); setIsModalOpen(true); };
  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try { await invoiceService.deleteInvoice(invoiceId); fetchInvoices(); }
      catch (err) { console.error('Error deleting invoice:', err); alert('Failed to delete invoice'); }
    }
  };
  const handleFormSuccess = () => { setIsModalOpen(false); fetchInvoices(); };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '—');

  const columns = [
    { title: 'Invoice #', key: 'no', render: (_, row) => `INV-${row._id?.slice(-6).toUpperCase()}` },
    { title: 'Client', key: 'client', render: (_, row) => row.client?.name || 'N/A' },
    { title: 'Date', key: 'date', render: (_, row) => formatDate(row.date) },
    { title: 'Due Date', key: 'due', render: (_, row) => formatDate(row.expiredDate) },
    { title: 'Amount', key: 'amount', render: (_, row) => `₹${row.total?.toLocaleString() || 0}` },
    { title: 'Payment Status', key: 'pstatus', render: (_, row) => (
        <Tag color={row.paymentStatus === 'paid' ? 'green' : row.paymentStatus === 'partial' ? 'gold' : 'red'}>
          {row.paymentStatus}
        </Tag>
      ) },
    { title: 'Status', key: 'status', render: (_, row) => (
        <Tag color={row.status === 'sent' ? 'blue' : row.status === 'draft' ? 'default' : row.status === 'cancelled' ? 'red' : 'gold'}>
          {row.status}
        </Tag>
      ) },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <Space>
          <Button onClick={(e) => { e.stopPropagation(); handleEditInvoice(row); }}>Edit</Button>
          <Button danger onClick={(e) => { e.stopPropagation(); handleDeleteInvoice(row._id); }}>Delete</Button>
        </Space>
      ) },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card title="Invoices" extra={<Button type="primary" onClick={handleCreateInvoice}>+ Create Invoice</Button>}>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Table
          columns={columns}
          dataSource={invoices}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({ onClick: () => navigate(`/invoices/${record._id}`) })}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}

        footer={null}
        width={900}
      >
        <InvoiceForm invoice={selectedInvoice} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default InvoicesPage;

