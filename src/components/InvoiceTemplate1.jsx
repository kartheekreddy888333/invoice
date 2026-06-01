import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { amountInWords } from '../utils/gstCalculations';

export default function InvoiceTemplate1({ invoice, company = {} }) {
  if (!invoice) return null;

  const items = invoice.items || [];

  return (
    <div className="bg-white p-8 font-serif text-gray-900" style={{ fontSize: '12px', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-400 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{company.companyName || 'Company Name'}</h1>
            <p className="text-xs mb-1">{company.address || 'Address'}</p>
            <p className="text-xs mb-1">GSTIN: {company.gstin || 'XX AAXXXXXXXXX X'}</p>
            <p className="text-xs mb-1">Phone: {company.phone || '(XXX) XXX-XXXX'}</p>
            <p className="text-xs">Email: {company.email || 'email@company.com'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2">INVOICE</div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-xs">
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
      <div className="grid grid-cols-2 gap-6 mb-6 text-xs border-y border-gray-300 py-3">
        <div>
          <p className="font-bold mb-2">Bill To:</p>
          <p className="font-bold">{invoice.customerName}</p>
          <p>{invoice.customerAddress || 'Address'}</p>
          <p>GSTIN: {invoice.customerGstin || 'N/A'}</p>
        </div>
        <div>
          <p className="font-bold mb-2">Ship To:</p>
          <p className="font-bold">{invoice.customerName}</p>
          <p>{invoice.customerAddress || 'Address'}</p>
          <p>Mobile: {invoice.customerMobile || 'N/A'}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4 text-xs border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-400 px-2 py-1 text-left w-8">SI</th>
            <th className="border border-gray-400 px-2 py-1 text-left">Product</th>
            <th className="border border-gray-400 px-2 py-1 text-center">HSN</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Qty</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Rate</th>
            <th className="border border-gray-400 px-2 py-1 text-right">Amount</th>
            <th className="border border-gray-400 px-2 py-1 text-center">GST %</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-400 px-2 py-1 text-center">{idx + 1}</td>
              <td className="border border-gray-400 px-2 py-1">{item.productName}</td>
              <td className="border border-gray-400 px-2 py-1 text-center">{item.hsnCode}</td>
              <td className="border border-gray-400 px-2 py-1 text-right">{item.quantity}</td>
              <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(item.rate)}</td>
              <td className="border border-gray-400 px-2 py-1 text-right font-bold">{formatCurrency(item.quantity * item.rate)}</td>
              <td className="border border-gray-400 px-2 py-1 text-center">{item.gstRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-6 mb-6">
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
      <div className="border-t-2 border-gray-400 pt-4 text-xs">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-bold mb-2">Bank Details:</p>
            <p>{company.bankName || 'Bank Name'}</p>
            <p>A/C: {company.accountNumber || 'XXXXX'}</p>
            <p>IFSC: {company.ifscCode || 'XXXXX'}</p>
          </div>
          <div className="text-center">
            <p className="font-bold mb-2">Terms & Conditions:</p>
            <p>{invoice.notes || 'Thank you for your business'}</p>
          </div>
          <div className="text-right">
            <p className="mb-8">_________________</p>
            <p className="font-bold">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
