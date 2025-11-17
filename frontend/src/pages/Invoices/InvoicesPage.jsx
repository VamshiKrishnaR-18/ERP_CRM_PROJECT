import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invoiceService from '../../api/invoiceService';
import InvoiceForm from './InvoiceForm';
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

  const handleDeleteInvoice = (invoiceId) => {
    Modal.confirm({
      title: 'Delete Invoice',
      content:
        'Are you sure you want to delete this invoice? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await invoiceService.deleteInvoice(invoiceId);
          fetchInvoices();
        } catch (err) {
          console.error('Error deleting invoice:', err);
          alert('Failed to delete invoice');
        }
      },
    });
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchInvoices();
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '—');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-foreground">Invoices</CardTitle>
            <CardDescription>Track and manage customer invoices.</CardDescription>
          </div>
          <CardAction>
            <Button className="cursor-pointer erp-primary-cta" variant="default" size="sm" onClick={handleCreateInvoice}>
              + Create Invoice
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
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}

              {invoices.map((invoice) => {
                const paymentStatus = invoice.paymentStatus || 'unpaid';
                const invoiceStatus = invoice.status || 'draft';

                const paymentColor =
                  paymentStatus === 'paid'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                    : paymentStatus === 'partial'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                    : 'bg-red-500/10 text-red-300 border-red-500/40';

                const statusColor =
                  invoiceStatus === 'sent'
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/40'
                    : invoiceStatus === 'cancelled'
                    ? 'bg-red-500/10 text-red-300 border-red-500/40'
                    : invoiceStatus === 'draft'
                    ? 'bg-zinc-500/10 text-zinc-300 border-zinc-500/40'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/40';

                const invoiceNumber = invoice._id
                  ? `INV-${invoice._id.slice(-6).toUpperCase()}`
                  : 'N/A';

                return (
                  <TableRow
                    key={invoice._id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <TableCell>{invoiceNumber}</TableCell>
                    <TableCell>{invoice.client?.name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatDate(invoice.expiredDate)}</TableCell>
                    <TableCell>{`₹${invoice.total?.toLocaleString() || 0}`}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`uppercase ${paymentColor}`}
                      >
                        {paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`uppercase ${statusColor}`}
                      >
                        {invoiceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${invoice._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteInvoice(invoice._id)}
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
        title={selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
        destroyOnHidden
        footer={null}
        width={900}
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

