import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Form, Input, Button, Card, Typography, Alert, Select } from 'antd';

function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      const { confirmPassword: _confirmPassword, ...userData } = values;
      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card style={{ width: 420 }}>
        <div className="text-center mb-2">
          <div className="inline-flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">E</div>
            <span className="font-semibold text-gray-900">ERP & CRM</span>
          </div>
        </div>

        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 4 }}>Create account</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 16 }}>
          Fill in your details to get started
        </Typography.Paragraph>

        {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}

        <Form layout="vertical" onFinish={onFinish} initialValues={{ role: 'staff' }}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item label="Email Address" name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]}>
            <Input placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }, { min: 6, message: 'Password must be at least 6 characters' }]}>
            <Input.Password placeholder="Enter your password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                }
              })
            ]}
          >
            <Input.Password placeholder="Confirm your password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Select a role' }]}>
            <Select options={[{ value: 'staff', label: 'Staff' }, { value: 'admin', label: 'Admin' }]} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Create Account
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;

