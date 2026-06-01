import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Download, Printer } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Invoices() {
  const { invoices, setInvoices, addNotification } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { key: 'customerName', label: 'Customer' },
    { key: 'invoiceDate', label: 'Date', render: (v) => formatDate(v) },
    { key: 'grandTotal', label: 'Amount', render: (v) => formatCurrency(v) },
    { key: 'outstandingAmount', label: 'Outstanding', render: (v) => formatCurrency(v || 0) },
    { 
      key: 'paymentStatus', 
      label: 'Payment',
      render: (v) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          v === 'paid'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : v === 'partially_paid'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {v === 'partially_paid' ? 'Partial' : v?.toUpperCase()}
        </span>
      )
    },
  ];

  const handleView = (invoice) => {
    setPreviewInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleDelete = (invoice) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(i => i.id !== invoice.id));
      addNotification('Invoice deleted successfully!', 'success');
    }
  };

  const handleSaveInvoice = (invoice) => {
    if (editingInvoice) {
      const updated = invoices.map(i => i.id === editingInvoice.id ? { ...invoice, id: editingInvoice.id } : i);
      setInvoices(updated);
      addNotification('Invoice updated successfully!', 'success');
      setIsFormOpen(false);
      setEditingInvoice(null);
    } else {
      const newInvoice = {
        ...invoice,
        id: Date.now(),
      };
      setInvoices([...invoices, newInvoice]);
      addNotification('Invoice created successfully!', 'success');
      // Automatically open preview for new invoice
      setPreviewInvoice(newInvoice);
      setIsPreviewOpen(true);
      setIsFormOpen(false);
      setEditingInvoice(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{invoices.length} total invoices</p>
          </div>
          <Button
            onClick={() => {
              setEditingInvoice(null);
              setIsFormOpen(true);
            }}
            icon={Plus}
          >
            Create Invoice
          </Button>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={invoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchable
            pagination
          />
        </Card>
      </div>

      {/* Invoice Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingInvoice(null);
        }}
        title={editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
        size="xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingInvoice(null);
          }}
        />
      </Modal>

      {/* Invoice Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Invoice Preview"
        size="lg"
      >
        {previewInvoice && <InvoicePreview invoice={previewInvoice} />}
      </Modal>
    </Layout>
  );
}
