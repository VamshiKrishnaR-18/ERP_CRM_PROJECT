import { useState, useEffect } from 'react';
import paymentService from '../../api/paymentService';
import PaymentForm from './PaymentForm';
import { Modal } from 'antd';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/erp/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/erp/ui/table';
import { Button } from '../../components/erp/ui/button';
import { Badge } from '../../components/erp/ui/badge';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchPayments(); }, []);

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

  const handleDeletePayment = (paymentId) => {
    Modal.confirm({
      title: 'Delete Payment',
      content: 'Are you sure you want to delete this payment? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await paymentService.deletePayment(paymentId);
          fetchPayments();
        } catch (err) {
          console.error('Error deleting payment:', err);
          alert('Failed to delete payment');
        }
      },
    });
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchPayments();
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '\u2014');


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-foreground">Payments</CardTitle>
            <CardDescription>Record and monitor customer payments.</CardDescription>
          </div>
          <CardAction>
            <Button className={"cursor-pointer erp-primary-cta"} variant="default" size="sm" onClick={handleCreatePayment}>
              + Record Payment
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <Table className="min-w-full text-sm">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No payments found.
                  </TableCell>
                </TableRow>
              )}

              {payments.map((payment) => {
                const status = payment.status || 'completed';

                const statusColor =
                  status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                    : status === 'pending'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                    : 'bg-red-500/10 text-red-300 border-red-500/40';

                const methodMap = {
                  cash: 'Cash',
                  credit_card: 'Credit Card',
                  bank_transfer: 'Bank Transfer',
                  upi: 'UPI',
                };

                const paymentMethodLabel =
                  methodMap[payment.paymentMethod] || payment.paymentMethod || 'N/A';

                const invoiceNumber = payment.invoice?._id
                  ? `INV-${payment.invoice._id.slice(-6).toUpperCase()}`
                  : 'N/A';

                return (
                  <TableRow key={payment._id}>
                    <TableCell>{invoiceNumber}</TableCell>
                    <TableCell>{payment.invoice?.client?.name || 'N/A'}</TableCell>
                    <TableCell>{`₹${payment.amount?.toLocaleString() || 0}`}</TableCell>
                    <TableCell>
                      {formatDate(payment.paymentDate || payment.createdAt)}
                    </TableCell>
                    <TableCell>{paymentMethodLabel}</TableCell>
                    <TableCell>{payment.reference || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`uppercase ${statusColor}`}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeletePayment(payment._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Record New Payment"
        destroyOnHidden
        footer={null}
        width={700}
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

