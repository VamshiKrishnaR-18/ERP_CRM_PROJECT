import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import analyticsService from '../../api/analyticsService';
import { Card, Alert, Spin, Row, Col, Statistic, Table, Tag, Space, Typography, Button } from 'antd';
import { DollarCircleOutlined, FileTextOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';

function DashboardPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await analyticsService.getDashboardSummary();
            setDashboardData(response.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }

    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Spin size="large" />
                <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    const recentColumns = [
        {
            title: 'Invoice #',
            key: 'id',
            render: (_, r) => r?.id ?? `INV-${String(r?._id || '').slice(-6).toUpperCase()}`,
        },
        {
            title: 'Client',
            key: 'client',
            render: (_, r) => r?.client?.name || 'N/A',
        },
        {
            title: 'Amount',
            key: 'amount',
            align: 'right',
            render: (_, r) => `₹${Number(r?.total || 0).toLocaleString()}`,
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (s) => <Tag color={s === 'paid' ? 'green' : s === 'partial' ? 'gold' : 'red'}>{s}</Tag>,
        },
    ];
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="px-6 py-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1">
                                Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">

                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                                {user?.role || 'user'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 max-w-7xl mx-auto">

                {error && (
                    <Alert
                        type="warning"
                        message={error}
                        showIcon
                        closable
                        onClose={() => setError('')}
                        className="mb-6"
                    />
                )}

                {/* Summary Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Link to="/invoices">
                            <Card hoverable>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div>
                                        <Typography.Text type="secondary">Total Revenue</Typography.Text>
                                        <Typography.Title level={3} style={{ margin: 0 }}>₹{Number(dashboardData?.totalRevenue || 0).toLocaleString()}</Typography.Title>
                                    </div>
                                    <DollarCircleOutlined style={{ fontSize: 32, color: '#1677ff' }} />
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link to="/invoices">
                            <Card hoverable>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div>
                                        <Typography.Text type="secondary">Total Invoices</Typography.Text>
                                        <Typography.Title level={3} style={{ margin: 0 }}>{Number(dashboardData?.totalInvoices || 0).toLocaleString()}</Typography.Title>
                                    </div>
                                    <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link to="/customers">
                            <Card hoverable>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div>
                                        <Typography.Text type="secondary">Total Customers</Typography.Text>
                                        <Typography.Title level={3} style={{ margin: 0 }}>{Number(dashboardData?.totalCustomers || 0).toLocaleString()}</Typography.Title>
                                    </div>
                                    <TeamOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Link to="/payments">
                            <Card hoverable>
                                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div>
                                        <Typography.Text type="secondary">Pending Payments</Typography.Text>
                                        <Typography.Title level={3} style={{ margin: 0 }}>₹{Number(dashboardData?.pendingPayments || 0).toLocaleString()}</Typography.Title>
                                    </div>
                                    <ClockCircleOutlined style={{ fontSize: 32, color: '#f5222d' }} />
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Card title="Quick Actions" style={{ marginBottom: 24 }}>
                    <Space wrap>
                        <Link to="/customers"><Button type="primary">Add Customer</Button></Link>
                        <Link to="/invoices"><Button>Create Invoice</Button></Link>
                        <Link to="/payments"><Button>Record Payment</Button></Link>
                        <Link to="/invoices"><Button type="dashed">View Reports</Button></Link>
                    </Space>
                </Card>

                {/* Recent Activity */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card title="Recent Invoices" extra={<Link to="/invoices">View All →</Link>}>
                            <Table
                                size="small"
                                columns={recentColumns}
                                dataSource={dashboardData?.recentInvoices || []}
                                rowKey={(r) => r._id || r.id}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Invoice Statistics">
                            <Row gutter={[12, 12]}>
                                <Col span={12}><Statistic title="Paid" value={Number(dashboardData?.paidInvoices || 0)} valueStyle={{ color: '#52c41a' }} /></Col>
                                <Col span={12}><Statistic title="Unpaid" value={Number(dashboardData?.unpaidInvoices || 0)} valueStyle={{ color: '#f5222d' }} /></Col>
                                <Col span={12}><Statistic title="Overdue" value={Number(dashboardData?.overdueInvoices || 0)} valueStyle={{ color: '#fa8c16' }} /></Col>
                                <Col span={12}><Statistic title="Partial" value={Number(dashboardData?.partialInvoices || 0)} valueStyle={{ color: '#faad14' }} /></Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default DashboardPage;

