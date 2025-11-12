import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../api/customerService';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import CustomerForm from './CustomerForm';

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
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Company', accessor: 'company' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs ${
                    row.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {row.enabled ? 'Active' : 'Inactive'}
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
                            handleEditCustomer(row);
                        }}
                        className="text-xs px-2 py-1"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(row._id);
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
                    <p className="mt-4 text-gray-600">Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card
                title="Customers"
                headerAction={
                    <Button onClick={handleCreateCustomer}>
                        + Add Customer
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
                    data={customers}
                    onRowClick={(customer) => navigate(`/customers/${customer._id}`)}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
                size="lg"
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

