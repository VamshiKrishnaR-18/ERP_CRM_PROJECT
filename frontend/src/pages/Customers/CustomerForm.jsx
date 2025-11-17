import { useEffect, useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import customerService from '../../api/customerService';

const { TextArea } = Input;

function CustomerForm({ customer, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        company: customer.company || ''
      });
    } else {
      form.resetFields();
    }
  }, [customer, form]);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      if (customer) {
        await customerService.updateCustomer(customer._id, values);
      } else {
        await customerService.createCustomer(values);
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving customer:', err);
      setError(err?.response?.data?.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="Enter customer name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item label="Company" name="company">
            <Input placeholder="Enter company name (optional)" />
          </Form.Item>
        </div>
        <Form.Item label="Address" name="address" rules={[{ required: true }]}
        >
          <TextArea rows={3} placeholder="Enter address" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {customer ? 'Update' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CustomerForm;

