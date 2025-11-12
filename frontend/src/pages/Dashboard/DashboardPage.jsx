import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext..jsx';
import analyticsService from '../../api/analyticsService';
import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';

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
                <Spinner size="xl" color="blue" />
                <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

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
                        onClose={() => setError('')}
                        className="mb-6"
                    />
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Link to="/invoices" className="group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Revenue</span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">₹{dashboardData?.totalRevenue?.toLocaleString() || '0'}</p>
                            <p className="text-xs text-gray-500 mt-2">View all invoices →</p>
                        </div>
                    </Link>

                    <Link to="/invoices" className="group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Invoices</span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Invoices</p>
                            <p className="text-3xl font-bold text-gray-900">{dashboardData?.totalInvoices || '0'}</p>
                            <p className="text-xs text-gray-500 mt-2">View all invoices →</p>
                        </div>
                    </Link>

                    <Link to="/customers" className="group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Customers</span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Total Customers</p>
                            <p className="text-3xl font-bold text-gray-900">{dashboardData?.totalCustomers || '0'}</p>
                            <p className="text-xs text-gray-500 mt-2">Manage customers →</p>
                        </div>
                    </Link>

                    <Link to="/payments" className="group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">Pending</span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-1">Pending Payments</p>
                            <p className="text-3xl font-bold text-gray-900">₹{dashboardData?.pendingPayments?.toLocaleString() || '0'}</p>
                            <p className="text-xs text-gray-500 mt-2">Track payments →</p>
                        </div>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link to="/customers" className="group">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Add Customer</p>
                                        <p className="text-xs text-gray-500">Create new</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/invoices" className="group">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">New Invoice</p>
                                        <p className="text-xs text-gray-500">Create</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/payments" className="group">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Record Payment</p>
                                        <p className="text-xs text-gray-500">Add payment</p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/invoices" className="group">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">View Reports</p>
                                        <p className="text-xs text-gray-500">Analytics</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Invoices</h3>
                        <Link to="/invoices" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {dashboardData?.recentInvoices?.length > 0 ? (
                            dashboardData.recentInvoices.slice(0, 5).map((invoice, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Invoice #{invoice.id}</p>
                                        <p className="text-sm text-gray-600">{invoice.client?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">₹{invoice.total?.toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                            invoice.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {invoice.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">No recent invoices</p>
                                <Link to="/invoices" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
                                    Create your first invoice
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Invoice Statistics</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-gray-700 font-medium">Paid Invoices</span>
                            </div>
                            <span className="font-bold text-green-600 text-lg">{dashboardData?.paidInvoices || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                <span className="text-gray-700 font-medium">Unpaid Invoices</span>
                            </div>
                            <span className="font-bold text-red-600 text-lg">{dashboardData?.unpaidInvoices || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                                <span className="text-gray-700 font-medium">Overdue Invoices</span>
                            </div>
                            <span className="font-bold text-orange-600 text-lg">{dashboardData?.overdueInvoices || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="text-gray-700 font-medium">Partial Payments</span>
                            </div>
                            <span className="font-bold text-yellow-600 text-lg">{dashboardData?.partialInvoices || 0}</span>
                        </div>
                    </div>
                </Card>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;

