import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { amountInWords } from '../utils/gstCalculations';

export default function InvoiceTemplate1({ invoice, company = {} }) {
  if (!invoice) return null;

  const seller = {
    companyName: 'Company Name',
    address: 'Address',
    gstin: 'XX AAXXXXXXXXX X',
    mobile: '(XXX) XXX-XXXX',
    email: 'email@company.com',
    bankName: 'Bank Name',
    accountNumber: 'XXXXX',
    ifscCode: 'XXXXX',
    ...company,
  };

  const customerData = {
    name: invoice.customer?.name || invoice.customer?.customerName || invoice.customerName || 'Customer Name',
    address: invoice.customer?.address || invoice.customerAddress || 'Address',
    gstin: invoice.customer?.gstin || invoice.customerGstin || 'N/A',
    mobile: invoice.customer?.mobile || invoice.customer?.mobileNumber || invoice.customerMobile || 'N/A',
  };

  const items = invoice.items || [];

  return (
    <div className="bg-white p-3 md:p-4 font-serif text-gray-900" style={{ fontSize: '11px', lineHeight: '1.3' }}>
      {/* Header */}
      <div className="mb-2 border-b-2 border-gray-400 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold mb-1">{seller.companyName}</h1>
            <p className="text-xs mb-1">{seller.address}</p>
            <p className="text-xs mb-1">GSTIN: {seller.gstin}</p>
            <p className="text-xs mb-1">Phone: {seller.mobile}</p>
            <p className="text-xs">Email: {seller.email}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2">INVOICE</div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
        <div>
          <p className="font-bold">Invoice No.: {invoice.invoiceNumber}</p>
          <p>Date: {new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</p>
        </div>
        <div className="text-center">
          <p className="font-bold">Due Date: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">GST Type: {invoice.gstType?.toUpperCase()}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-2 mb-2 text-xs border-y border-gray-300 py-1">
        <div>
          <p className="font-bold mb-2">Bill To:</p>
          <p className="font-bold">{customerData.name}</p>
          <p>{customerData.address}</p>
          <p>GSTIN: {customerData.gstin}</p>
        </div>
        <div>
          <p className="font-bold mb-2">Ship To:</p>
          <p className="font-bold">{customerData.name}</p>
          <p>{customerData.address}</p>
          <p>Mobile: {customerData.mobile}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-2 text-xs border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-400 px-2 py-1 text-left w-8">SI</th>
            <th className="border border-gray-400 px-1 py-0.5 text-left">Product</th>
            <th className="border border-gray-400 px-1 py-0.5 text-center">HSN</th>
            <th className="border border-gray-400 px-1 py-0.5 text-right">Qty</th>
            <th className="border border-gray-400 px-1 py-0.5 text-right">Rate</th>
            <th className="border border-gray-400 px-1 py-0.5 text-right">Amount</th>
            <th className="border border-gray-400 px-2 py-1 text-center">GST %</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-400 px-1 py-0.5 text-center">{idx + 1}</td>
              <td className="border border-gray-400 px-1 py-0.5">{item.productName}</td>
              <td className="border border-gray-400 px-1 py-0.5 text-center">{item.hsnCode}</td>
              <td className="border border-gray-400 px-1 py-0.5 text-right">{item.quantity}</td>
              <td className="border border-gray-400 px-1 py-0.5 text-right">{formatCurrency(item.rate)}</td>
              <td className="border border-gray-400 px-1 py-0.5 text-right font-bold">{formatCurrency(item.quantity * item.rate)}</td>
              <td className="border border-gray-400 px-1 py-0.5 text-center">{item.gstRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="text-xs">
          <p className="font-bold mb-2">Amount In Words:</p>
          <p className="italic">{amountInWords(Math.floor(invoice.grandTotal))}</p>
        </div>
        <div className="text-xs">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="text-right pr-3 py-1">Subtotal:</td>
                <td className="text-right font-bold">{formatCurrency(invoice.subtotal || invoice.grandTotal)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="text-right pr-3 py-1">GST:</td>
                <td className="text-right font-bold">{formatCurrency(invoice.totalGST || 0)}</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="text-right pr-3 py-1">Grand Total:</td>
                <td className="text-right">{formatCurrency(invoice.grandTotal || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-400 pt-2 text-xs">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="font-bold mb-1">Terms & Conditions:</p>
            <p>{invoice.notes || 'Thank you for your business'}</p>
          </div>
          <div className="text-right">
            <p className="mb-4">_________________</p>
            <p className="font-bold">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
