import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../api/customerService';
import CustomerForm from './CustomerForm';
import { Table, Button, Card, Modal, Tag, Space, Spin, Alert } from 'antd';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(customerId);
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert('Failed to delete customer');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchCustomers();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    {
      title: 'Status', key: 'enabled',
      render: (_, row) => (
        <Tag color={row.enabled ? 'green' : 'red'}>{row.enabled ? 'Active' : 'Inactive'}</Tag>
      )
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, row) => (
        <Space>
          <Button
            onClick={(e) => { e.stopPropagation(); handleEditCustomer(row); }}
          >Edit</Button>
          <Button danger onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(row._id); }}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card
        title="Customers"
        extra={<Button type="primary" onClick={handleCreateCustomer}>+ Add Customer</Button>}
      >
        {error && (
          <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
        )}

        <Table
          columns={columns}
          dataSource={customers}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({ onClick: () => navigate(`/customers/${record._id}`) })}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        destroyOnClose
        footer={null}
        width={700}
      >
        <CustomerForm
          customer={selectedCustomer}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default CustomersPage;

