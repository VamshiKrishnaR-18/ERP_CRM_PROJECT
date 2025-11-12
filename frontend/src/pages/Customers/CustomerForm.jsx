import { useState, useEffect } from 'react';
import customerService from '../../api/customerService';
import Input from '../../components/Input';
import Button from '../../components/Button';

function CustomerForm({ customer, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || '',
                company: customer.company || ''
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (customer) {
                await customerService.updateCustomer(customer._id, formData);
            } else {
                await customerService.createCustomer(formData);
            }
            onSuccess();
        } catch (err) {
            console.error('Error saving customer:', err);
            setError(err.response?.data?.message || 'Failed to save customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <Input
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
            />

            <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
            />

            <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
            />

            <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
            />

            <Input
                label="Company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name (optional)"
            />

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : customer ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}

export default CustomerForm;

