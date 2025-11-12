import { useState, useEffect } from 'react';
import paymentService from '../../api/paymentService';
import invoiceService from '../../api/invoiceService';
import Input from '../../components/Input';
import Button from '../../components/Button';

function PaymentForm({ onSuccess, onCancel }) {
    const [invoices, setInvoices] = useState([]);
    const [formData, setFormData] = useState({
        invoice: '',
        amount: 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        reference: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await invoiceService.getAllInvoices();
            // Filter unpaid or partially paid invoices
            const unpaidInvoices = response.data.filter(
                inv => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partial'
            );
            setInvoices(unpaidInvoices);
        } catch (err) {
            console.error('Error fetching invoices:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Auto-fill amount when invoice is selected
        if (name === 'invoice') {
            const selectedInvoice = invoices.find(inv => inv._id === value);
            if (selectedInvoice) {
                setFormData(prev => ({
                    ...prev,
                    invoice: value,
                    amount: selectedInvoice.total - (selectedInvoice.credit || 0)
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await paymentService.createPayment(formData);
            onSuccess();
        } catch (err) {
            console.error('Error creating payment:', err);
            setError(err.response?.data?.message || 'Failed to record payment');
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

            <div className="mb-4">
                <label htmlFor="invoice" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice <span className="text-red-500">*</span>
                </label>
                <select
                    id="invoice"
                    name="invoice"
                    value={formData.invoice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Select an invoice</option>
                    {invoices.map((invoice) => (
                        <option key={invoice._id} value={invoice._id}>
                            INV-{invoice._id.slice(-6).toUpperCase()} - {invoice.client?.name} - ₹{invoice.total}
                        </option>
                    ))}
                </select>
            </div>

            <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter payment amount"
                required
            />

            <div className="mb-4">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="cheque">Cheque</option>
                </select>
            </div>

            <Input
                label="Payment Date"
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
            />

            <Input
                label="Reference Number"
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Transaction reference (optional)"
            />

            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes (optional)"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Recording...' : 'Record Payment'}
                </Button>
            </div>
        </form>
    );
}

export default PaymentForm;

