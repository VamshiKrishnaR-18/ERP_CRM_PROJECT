import { useState, useEffect } from 'react';
import invoiceService from '../../api/invoiceService';
import customerService from '../../api/customerService';
import Input from '../../components/Input';
import Button from '../../components/Button';

function InvoiceForm({ invoice, onSuccess, onCancel }) {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        client: '',
        date: new Date().toISOString().split('T')[0],
        expiredDate: '',
        year: new Date().getFullYear(),
        currency: 'INR',
        discount: 0,
        credit: 0,
        items: [
            {
                itemName: '',
                description: '',
                quantity: 1,
                price: 0,
                discount: 0,
                taxRate: 0
            }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomers();
        if (invoice) {
            setFormData({
                client: invoice.client?._id || '',
                date: invoice.date?.split('T')[0] || '',
                expiredDate: invoice.expiredDate?.split('T')[0] || '',
                year: invoice.year || new Date().getFullYear(),
                currency: invoice.currency || 'INR',
                discount: invoice.discount || 0,
                credit: invoice.credit || 0,
                items: invoice.items || []
            });
        }
    }, [invoice]);

    const fetchCustomers = async () => {
        try {
            const response = await customerService.getAllCustomers();
            setCustomers(response.data);
        } catch (err) {
            console.error('Error fetching customers:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    itemName: '',
                    description: '',
                    quantity: 1,
                    price: 0,
                    discount: 0,
                    taxRate: 0
                }
            ]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (invoice) {
                await invoiceService.updateInvoice(invoice._id, formData);
            } else {
                await invoiceService.createInvoice(formData);
            }
            onSuccess();
        } catch (err) {
            console.error('Error saving invoice:', err);
            setError(err.response?.data?.message || 'Failed to save invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                        Client <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="client"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a client</option>
                        {customers.map((customer) => (
                            <option key={customer._id} value={customer._id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Year"
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                />
            </div>


            {/* Invoice Items */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-700">Invoice Items</h4>
                    <Button type="button" variant="outline" onClick={addItem} className="text-sm">
                        + Add Item
                    </Button>
                </div>

                {formData.items.map((item, index) => (
                    <div key={index} className="border p-4 rounded mb-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-sm">Item {index + 1}</h5>
                            {formData.items.length > 1 && (
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={() => removeItem(index)}
                                    className="text-xs px-2 py-1"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Item Name"
                                type="text"
                                value={item.itemName}
                                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                required
                            />
                            <Input
                                label="Description"
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                required
                            />
                            <Input
                                label="Price"
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                required
                            />
                            <Input
                                label="Discount (%)"
                                type="number"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                            />
                            <Input
                                label="Tax Rate (%)"
                                type="number"
                                value={item.taxRate}
                                onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Input
                    label="Currency"
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Discount"
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                />
                <Input
                    label="Credit"
                    type="number"
                    name="credit"
                    value={formData.credit}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
            </div>
        </form>
    );
}

export default InvoiceForm;
