import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Alert } from 'antd';
import invoiceService from '../../api/invoiceService';
import customerService from '../../api/customerService';

function InvoiceForm({ invoice, onSuccess, onCancel }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  useEffect(() => { (async () => {
    try { const res = await customerService.getAllCustomers(); setCustomers(res.data); } catch { /* ignore */ }
  })(); }, []);

  useEffect(() => {
    if (invoice) {
      form.setFieldsValue({
        client: invoice.client?._id || '',
        year: invoice.year || new Date().getFullYear(),
        currency: invoice.currency || 'INR',
        discount: invoice.discount || 0,
        credit: invoice.credit || 0,
        items: invoice.items?.length ? invoice.items : [{ itemName: '', description: '', quantity: 1, price: 0, discount: 0, taxRate: 0 }]
      });
    } else {
      form.setFieldsValue({
        year: new Date().getFullYear(),
        currency: 'INR',
        discount: 0,
        credit: 0,
        items: [{ itemName: '', description: '', quantity: 1, price: 0, discount: 0, taxRate: 0 }]
      });
    }
  }, [invoice, form]);

  const onFinish = async (values) => {
    setLoading(true); setError('');
    try {
      if (invoice) await invoiceService.updateInvoice(invoice._id, values);
      else await invoiceService.createInvoice(values);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save invoice');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Client" name="client" rules={[{ required: true, message: 'Select a client' }]}>
            <Select placeholder="Select a client" options={customers.map(c => ({ value: c._id, label: c.name }))} />
          </Form.Item>
          <Form.Item label="Year" name="year" rules={[{ required: true }]}>
            <InputNumber min={2000} max={2100} className="w-full" />
          </Form.Item>
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Invoice Items</h4>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="border p-3 rounded mb-3 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Form.Item {...restField} name={[name, 'itemName']} label="Item Name" rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'description']} label="Description">
                          <Input />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'quantity']} label="Quantity" rules={[{ required: true }]}>
                          <InputNumber min={1} className="w-full" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'price']} label="Price" rules={[{ required: true }]}>
                          <InputNumber min={0} step={0.01} className="w-full" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'discount']} label="Discount (%)">
                          <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'taxRate']} label="Tax Rate (%)">
                          <InputNumber min={0} max={100} className="w-full" />
                        </Form.Item>
                      </div>
                      {fields.length > 1 && (
                        <Button danger onClick={() => remove(name)} size="small">Remove</Button>
                      )}
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add({ itemName: '', description: '', quantity: 1, price: 0, discount: 0, taxRate: 0 })} block>
                    + Add Item
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Discount" name="discount">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Credit" name="credit">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2 border-t pt-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>{invoice ? 'Update Invoice' : 'Create Invoice'}</Button>
        </div>
      </Form>
    </div>
  );
}

export default InvoiceForm;
