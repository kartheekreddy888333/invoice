import React, { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from './Button';
import { Input, Select, Textarea } from './FormInputs';
import { useApp } from '../context/AppContext';
import { generateInvoiceNumber, calculateInvoiceTotals } from '../utils/gstCalculations';
import { formatCurrency } from '../utils/formatters';

const GST_TYPES = [
  { value: 'cgst+sgst', label: 'CGST + SGST (Intra-state)' },
  { value: 'igst', label: 'IGST (Inter-state)' },
  { value: 'exempt', label: 'GST Exempt' },
  { value: 'zero', label: 'Zero Rated' },
  { value: 'reverse', label: 'Reverse Charge' },
  { value: 'composition', label: 'Composition Scheme' },
];

export default function InvoiceForm({ invoice, onSave, onCancel }) {
  const { customers, products, company, deductStock, addNotification } = useApp();
  const [formData, setFormData] = useState(invoice || {
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerId: '',
    customerName: '',
    gstType: 'cgst+sgst',
    items: [],
    discount: 0,
    roundOff: 0,
    notes: '',
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMode: 'Credit',
    paidAmount: 0,
    outstandingAmount: 0,
    transportDetails: '',
    vehicleNumber: '',
    eWayBillNumber: '',
    // Tally Prime fields
    deliveryNote: '',
    referenceNo: '',
    buyerOrderNo: '',
    dispatchDocNo: '',
    deliveryNoteDate: '',
    dispatchedThrough: '',
    destination: '',
    billOfLading: '',
    termsOfDelivery: '',
  });
  const [stockErrors, setStockErrors] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const totals = useMemo(() => {
    return calculateInvoiceTotals(formData.items || [], formData.roundOff || 0, formData.gstType);
  }, [formData.items, formData.roundOff, formData.gstType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.id == customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.customerName || '',
      customer: customer
        ? {
            id: customer.id,
            name: customer.customerName || '',
            customerName: customer.customerName || '',
            address: customer.address || '',
            gstin: customer.gstin || '',
            mobile: customer.mobileNumber || '',
            mobileNumber: customer.mobileNumber || '',
            state: customer.state || '',
            stateCode: customer.stateCode || '',
          }
        : null,
      customerAddress: customer?.address || '',
      customerGstin: customer?.gstin || '',
      customerMobile: customer?.mobileNumber || '',
      customerState: customer?.state || '',
      customerStateCode: customer?.stateCode || '',
    }));
  };

  const handleAddItem = () => {
    if (selectedProduct && itemQuantity) {
      const product = products.find(p => p.id == selectedProduct);
      if (product) {
        const qty = parseInt(itemQuantity) || 0;
        if (product.currentStock < qty) {
          addNotification(`Insufficient stock for ${product.productName}. Available: ${product.currentStock}`, 'error');
          return;
        }
        const taxableAmount = qty * parseFloat(product.sellingPrice || product.price);
        const newItem = {
          id: Date.now(),
          productId: product.id,
          productName: product.productName,
          hsnCode: product.hsnCode,
          quantity: qty,
          unit: product.unit,
          rate: parseFloat(product.sellingPrice || product.price),
          gstRate: parseFloat(product.gstRate || 0),
          taxableAmount,
          discountAmount: 0,
        };
        setFormData(prev => ({
          ...prev,
          items: [...(prev.items || []), newItem],
        }));
        setSelectedProduct('');
        setItemQuantity('');
        setStockErrors([]);
      }
    }
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id),
    }));
  };

  const handleUpdateItem = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.taxableAmount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || formData.items.length === 0) {
      alert('Please select a customer and add items');
      return;
    }

    const invoiceData = {
      ...formData,
      ...totals,
      paymentStatus: formData.paymentStatus,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      outstandingAmount: totals.grandTotal - (parseFloat(formData.paidAmount) || 0),
      lastPaymentDate: formData.paymentStatus === 'paid' ? new Date().toISOString() : null,
    };

    if (!invoice) {
      deductStock(formData.items);
    }

    onSave(invoiceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Invoice Header */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Invoice #"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
          disabled
        />
        <Input
          label="Invoice Date"
          name="invoiceDate"
          type="date"
          value={formData.invoiceDate}
          onChange={handleChange}
          required
        />
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      {/* Customer & GST Type */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Customer"
          name="customerId"
          value={formData.customerId}
          onChange={handleCustomerChange}
          options={customers.map(c => ({ value: c.id, label: c.customerName }))}
          required
        />
        <Select
          label="GST Type"
          name="gstType"
          value={formData.gstType}
          onChange={handleChange}
          options={GST_TYPES}
        />
      </div>

      {/* Tally Prime Invoice Details */}
      <div className="border-t pt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tally Prime Invoice Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Delivery Note"
            name="deliveryNote"
            value={formData.deliveryNote || ''}
            onChange={handleChange}
            placeholder="DN-2026-001"
          />
          <Input
            label="Mode of Payment"
            name="paymentMode"
            value={formData.paymentMode || 'Credit'}
            onChange={handleChange}
            placeholder="Credit / Cash"
          />
          <Input
            label="Reference No. & Date"
            name="referenceNo"
            value={formData.referenceNo || ''}
            onChange={handleChange}
            placeholder="Ref No"
          />
          <Input
            label="Buyer's Order No."
            name="buyerOrderNo"
            value={formData.buyerOrderNo || ''}
            onChange={handleChange}
            placeholder="Order No"
          />
          <Input
            label="Dispatch Doc No."
            name="dispatchDocNo"
            value={formData.dispatchDocNo || ''}
            onChange={handleChange}
            placeholder="Dispatch Doc"
          />
          <Input
            label="Delivery Note Date"
            name="deliveryNoteDate"
            type="date"
            value={formData.deliveryNoteDate || ''}
            onChange={handleChange}
          />
          <Input
            label="Dispatched Through"
            name="dispatchedThrough"
            value={formData.dispatchedThrough || ''}
            onChange={handleChange}
            placeholder="Courier / Truck / etc"
          />
          <Input
            label="Destination"
            name="destination"
            value={formData.destination || ''}
            onChange={handleChange}
            placeholder="City / Place"
          />
          <Input
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber || ''}
            onChange={handleChange}
            placeholder="MH-01-AB-1234"
          />
          <Input
            label="Bill of Lading/LR-RR No."
            name="billOfLading"
            value={formData.billOfLading || ''}
            onChange={handleChange}
            placeholder="LR No"
          />
          <Input
            label="Terms Of Delivery"
            name="termsOfDelivery"
            value={formData.termsOfDelivery || ''}
            onChange={handleChange}
            placeholder="FOB / CIF / etc"
          />
          <Input
            label="eWay Bill Number"
            name="eWayBillNumber"
            value={formData.eWayBillNumber || ''}
            onChange={handleChange}
            placeholder="eWay Bill No"
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Items</h3>
        <div className="grid grid-cols-12 gap-2 mb-4">
          <div className="col-span-5">
            <Select
              label="Product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              options={products.map(p => ({ value: p.id, label: `${p.productName} (${p.unit})` }))}
            />
          </div>
          <div className="col-span-4">
            <Input
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="col-span-3 flex items-end">
            <Button
              type="button"
              onClick={handleAddItem}
              icon={Plus}
              size="sm"
              fullWidth
            >
              Add
            </Button>
          </div>
        </div>

        {/* Items Table */}
        {formData.items && formData.items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-2 py-2 text-left">Product</th>
                  <th className="px-2 py-2 text-left">HSN</th>
                  <th className="px-2 py-2 text-right">Qty</th>
                  <th className="px-2 py-2 text-right">Rate</th>
                  <th className="px-2 py-2 text-right">Amount</th>
                  <th className="px-2 py-2 text-right">GST %</th>
                  <th className="px-2 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map(item => (
                  <tr key={item.id} className="border-b dark:border-gray-700">
                    <td className="px-2 py-2">{item.productName}</td>
                    <td className="px-2 py-2">{item.hsnCode}</td>
                    <td className="px-2 py-2 text-right">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border rounded text-right"
                      />
                    </td>
                    <td className="px-2 py-2 text-right">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, 'rate', parseFloat(e.target.value))}
                        className="w-24 px-2 py-1 border rounded text-right"
                        step="0.01"
                      />
                    </td>
                    <td className="px-2 py-2 text-right">{formatCurrency(item.taxableAmount)}</td>
                    <td className="px-2 py-2 text-right">{item.gstRate}%</td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Subtotal</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totals.subtotal)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">GST</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totals.totalGST)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Grand Total</p>
          <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(totals.grandTotal)}</p>
        </div>
      </div>

      {/* Payment Status Section */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Payment Status"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            options={[
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'partially_paid', label: 'Partially Paid' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
          <Input
            label="Paid Amount"
            name="paidAmount"
            type="number"
            step="0.01"
            value={formData.paidAmount || 0}
            onChange={handleChange}
            placeholder="0"
          />
          <div className="pt-6">
            <p className="text-xs text-gray-600 dark:text-gray-400">Outstanding</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(Math.max(0, totals.grandTotal - (parseFloat(formData.paidAmount) || 0)))}</p>
          </div>
        </div>
      </div>

      {/* Notes & Round Off */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Invoice Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <Input
          label="Round Off"
          name="roundOff"
          type="number"
          step="0.01"
          value={formData.roundOff}
          onChange={handleChange}
        />
      </div>

      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        placeholder="Add invoice notes or terms"
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" fullWidth>
          {invoice ? 'Update' : 'Create'} Invoice
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          Cancel
        </Button>
      </div>
    </form>
  );
}
