import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../../api/invoiceService';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import InvoiceForm from './InvoiceForm';

function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, []);

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

    const handleCreateInvoice = () => {
        setSelectedInvoice(null);
        setIsModalOpen(true);
    };

    const handleEditInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleDeleteInvoice = async (invoiceId) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await invoiceService.deleteInvoice(invoiceId);
                fetchInvoices();
            } catch (err) {
                console.error('Error deleting invoice:', err);
                alert('Failed to delete invoice');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchInvoices();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const columns = [
        { 
            header: 'Invoice #', 
            render: (row) => `INV-${row._id?.slice(-6).toUpperCase()}`
        },
        { 
            header: 'Client', 
            render: (row) => row.client?.name || 'N/A'
        },
        { 
            header: 'Date', 
            render: (row) => formatDate(row.date)
        },
        { 
            header: 'Due Date', 
            render: (row) => formatDate(row.expiredDate)
        },
        { 
            header: 'Amount', 
            render: (row) => `₹${row.total?.toLocaleString() || 0}`
        },
        {
            header: 'Payment Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    row.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    row.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {row.paymentStatus}
                </span>
            )
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    row.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    row.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    row.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditInvoice(row);
                        }}
                        className="text-xs px-2 py-1"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(row._id);
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
                    <p className="mt-4 text-gray-600">Loading invoices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card
                title="Invoices"
                headerAction={
                    <Button onClick={handleCreateInvoice}>
                        + Create Invoice
                    </Button>
                }
            >
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <Table
                    columns={columns}
                    data={invoices}
                    onRowClick={(invoice) => navigate(`/invoices/${invoice._id}`)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                size="xl"
            >
                <InvoiceForm
                    invoice={selectedInvoice}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default InvoicesPage;

