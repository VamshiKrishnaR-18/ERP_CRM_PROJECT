import { useState, useEffect } from 'react';
import paymentService from '../../api/paymentService';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import PaymentForm from './PaymentForm';

function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, []);

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

    const handleCreatePayment = () => {
        setIsModalOpen(true);
    };

    const handleDeletePayment = async (paymentId) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                await paymentService.deletePayment(paymentId);
                fetchPayments();
            } catch (err) {
                console.error('Error deleting payment:', err);
                alert('Failed to delete payment');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchPayments();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const columns = [
        { 
            header: 'Payment #', 
            render: (row) => `PAY-${row._id?.slice(-6).toUpperCase()}`
        },
        { 
            header: 'Invoice', 
            render: (row) => `INV-${row.invoice?._id?.slice(-6).toUpperCase() || 'N/A'}`
        },
        { 
            header: 'Amount', 
            render: (row) => `₹${row.amount?.toLocaleString() || 0}`
        },
        { 
            header: 'Payment Method', 
            accessor: 'paymentMethod'
        },
        { 
            header: 'Date', 
            render: (row) => formatDate(row.paymentDate || row.createdAt)
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    row.status === 'completed' ? 'bg-green-100 text-green-800' :
                    row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {row.status || 'completed'}
                </span>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePayment(row._id);
                        }}
                        className="text-xs px-2 py-1"
                    >
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card
                title="Payments"
                headerAction={
                    <Button onClick={handleCreatePayment}>
                        + Record Payment
                    </Button>
                }
            >
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <Table columns={columns} data={payments} />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Record New Payment"
                size="lg"
            >
                <PaymentForm
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default PaymentsPage;

