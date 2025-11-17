import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Select, Alert } from 'antd';
import paymentService from '../../api/paymentService';
import invoiceService from '../../api/invoiceService';

function PaymentForm({ onSuccess, onCancel }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      try {
        const response = await invoiceService.getAllInvoices();
        const list = Array.isArray(response?.data) ? response.data : [];
        const openInvoices = list.filter((inv) => inv.paymentStatus !== 'paid');
        setInvoices(openInvoices);
      } catch (err) {
        console.error('Error loading invoices for payment:', err);
        setError(err?.response?.data?.message || 'Failed to load invoices');
      }
    })();
  }, []);

  const onValuesChange = (changed) => {
    if (changed.invoice) {
      const inv = invoices.find(i => i._id === changed.invoice);
      if (inv) form.setFieldsValue({ amount: (inv.total || 0) - (inv.credit || 0) });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        invoiceId: values.invoice,
        amount: values.amount,
        method: values.paymentMethod,
        reference: values.reference,
        // NOTE: backend currently only stores invoiceId, amount, method, reference
        // If you want to persist paymentDate/notes, we can extend the API later.
      };
      await paymentService.createPayment(payload);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}
      <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={onValuesChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Invoice" name="invoice" rules={[{ required: true, message: 'Select an invoice' }]}>
            <Select
              placeholder="Select an invoice"
              options={invoices.map(inv => ({
                value: inv._id,
                label: `INV-${inv._id?.slice(-6).toUpperCase()} - ${inv.client?.name} - ₹${inv.total}`,
              }))}
            />
          </Form.Item>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Enter amount' }]}>
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>
          {invoices.length === 0 && !error && (
            <p className="text-xs text-muted-foreground">
              No open invoices found. Create an invoice first.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Payment Method" name="paymentMethod" initialValue="cash" rules={[{ required: true }]}>
            <Select options={[{value:'cash',label:'Cash'},{value:'bank_transfer',label:'Bank Transfer'},{value:'credit_card',label:'Credit Card'},{value:'debit_card',label:'Debit Card'},{value:'upi',label:'UPI'},{value:'cheque',label:'Cheque'}]} />
          </Form.Item>
          <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <Form.Item label="Reference Number" name="reference">
          <Input placeholder="Transaction reference (optional)" />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} placeholder="Additional notes (optional)" />
        </Form.Item>
        <div className="flex justify-end gap-2 pt-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Record Payment</Button>
        </div>
      </Form>
    </div>
  );
}

export default PaymentForm;

