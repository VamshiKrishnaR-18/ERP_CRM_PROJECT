import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Form, Input, Button, Card, Typography, Alert, Checkbox } from 'antd';

function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async ({ email, password }) => {
        setLoading(true);
        setError('');
        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            const errMessage = err?.response?.data?.message || 'Login failed';
            setError(errMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card style={{ width: 380 }}>
                <div className="text-center mb-1">
                    <div className="inline-flex items-center space-x-2 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">E</div>
                        <span className="font-semibold text-gray-900">ERP & CRM</span>
                    </div>
                </div>

                <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 4 }}>Sign In</Typography.Title>
                <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 16 }}>
                    Enter your credentials to access your account
                </Typography.Paragraph>

                {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}

                <Form layout="vertical" onFinish={onFinish} initialValues={{ remember: true }}>
                    <Form.Item label="Email Address" name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]}>
                        <Input placeholder="you@example.com" autoComplete="email" />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
                        <Input.Password placeholder="Enter your password" autoComplete="current-password" />
                    </Form.Item>

                    <div className="flex items-center justify-between mb-4">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link to="#" className="text-blue-600 hover:text-blue-700">Forgot password?</Link>
                    </div>

                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Sign In
                    </Button>
                </Form>

                <div className="mt-4 text-center">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/register" className="text-blue-600 hover:text-blue-700">Create one</Link>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;