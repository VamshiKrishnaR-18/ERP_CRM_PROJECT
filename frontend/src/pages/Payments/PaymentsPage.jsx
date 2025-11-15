import { useState, useEffect } from 'react';
import paymentService from '../../api/paymentService';
import PaymentForm from './PaymentForm';
import { Table, Button, Card, Modal, Space, Spin, Alert } from 'antd';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments();
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = () => { setIsModalOpen(true); };
  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try { await paymentService.deletePayment(paymentId); fetchPayments(); }
      catch (err) { console.error('Error deleting payment:', err); alert('Failed to delete payment'); }
    }
  };
  const handleFormSuccess = () => { setIsModalOpen(false); fetchPayments(); };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '\u2014');

  const columns = [
    { title: 'Payment #', key: 'no', render: (_, row) => `PAY-${row._id?.slice(-6).toUpperCase()}` },
    { title: 'Invoice', key: 'invoice', render: (_, row) => `INV-${row.invoice?._id?.slice(-6).toUpperCase() || 'N/A'}` },
    { title: 'Amount', key: 'amount', render: (_, row) => `₹${row.amount?.toLocaleString() || 0}` },
    { title: 'Payment Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'Date', key: 'date', render: (_, row) => formatDate(row.paymentDate || row.createdAt) },
    { title: 'Status', key: 'status', render: (_, row) => row.status || 'completed' },
    { title: 'Actions', key: 'actions', render: (_, row) => (
        <Space>
          <Button danger onClick={(e) => { e.stopPropagation(); handleDeletePayment(row._id); }}>Delete</Button>
        </Space>
      )},
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card title="Payments" extra={<Button type="primary" onClick={handleCreatePayment}>+ Record Payment</Button>}>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Table columns={columns} dataSource={payments} rowKey="_id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Record New Payment"
        footer={null}
        width={700}
      >
        <PaymentForm onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default PaymentsPage;

