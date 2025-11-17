import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import analyticsService from '../../api/analyticsService';
import { Card, Alert, Spin, Row, Col, Statistic, Table, Tag, Space, Button } from 'antd';
import { DollarOutlined, FileTextOutlined, TeamOutlined, ClockCircleOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';

function DashboardPage() {
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

    const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '—');

    const recentColumns = [
        {
            title: 'Invoice',
            key: 'invoice',
            render: (_, r) =>
                r?.id ?? `INV-${String(r?._id || '').slice(-6).toUpperCase()}`,
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_, r) => r?.client?.name || 'N/A',
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (_, r) => `₹${Number(r?.total || 0).toLocaleString()}`,
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status) => {
                let color = 'default';
                if (status === 'paid') color = 'green';
                else if (status === 'partial') color = 'gold';
                else if (status === 'unpaid' || status === 'overdue') color = 'red';
                return <Tag color={color}>{(status || '').toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Date',
            key: 'date',
            render: (_, r) =>
                formatDate(r?.date || r?.expiredDate || r?.createdAt),
        },
    ];

    return (
        <div className="space-y-6">
            {error && (
                <Alert
                    type="warning"
                    message={error}
                    showIcon
                    closable
                    onClose={() => setError('')}
                />
            )}

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Link to="/invoices">
                        <Card hoverable className="transition-all duration-200">
                            <Statistic
                                title="Total Revenue"
                                value={Number(dashboardData?.totalRevenue || 0)}
                                precision={2}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#2563EB' }}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Link to="/invoices">
                        <Card hoverable className="transition-all duration-200">
                            <Statistic
                                title="Total Invoices"
                                value={Number(dashboardData?.totalInvoices || 0)}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: '#16A34A' }}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Link to="/customers">
                        <Card hoverable className="transition-all duration-200">
                            <Statistic
                                title="Total Customers"
                                value={Number(dashboardData?.totalCustomers || 0)}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#DC2626' }}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Link to="/invoices">
                        <Card hoverable className="transition-all duration-200">
                            <Statistic
                                title="Pending Invoices"
                                value={Number(dashboardData?.pendingInvoices || dashboardData?.pendingPayments || 0)}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#F59E0B' }}
                            />
                        </Card>
                    </Link>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="Recent Invoices"
                        extra={<Link to="/invoices">View All →</Link>}
                    >
                        <Table
                            size="small"
                            columns={recentColumns}
                            dataSource={dashboardData?.recentInvoices || []}
                            rowKey={(r) => r._id || r.id}
                            pagination={false}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Quick Actions">
                        <Space
                            direction="vertical"
                            className="w-full"
                            size="middle"
                        >
                            <Link to="/invoices" className="block">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    block
                                >
                                    Create Invoice
                                </Button>
                            </Link>
                            <Link to="/customers" className="block">
                                <Button
                                    icon={<UserAddOutlined />}
                                    block
                                >
                                    Add Customer
                                </Button>
                            </Link>
                            <Link to="/payments" className="block">
                                <Button
                                    icon={<DollarOutlined />}
                                    block
                                >
                                    Record Payment
                                </Button>
                            </Link>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardPage;

