import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { amountInWords } from '../utils/gstCalculations';

export default function InvoiceTemplate2({ invoice, company = {} }) {
  if (!invoice) return null;

  const seller = {
    companyName: 'Company Name',
    address: 'Address',
    gstin: 'XX AAXXXXXXXXX X',
    mobile: '(XXX) XXX-XXXX',
    bankName: 'Bank Name',
    accountNumber: 'XXXXX',
    ifscCode: 'XXXXX',
    upiId: 'N/A',
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
    <div className="bg-white text-gray-800">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 mb-3">
        <div className="flex justify-between items-start max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-bold mb-0.5">{seller.companyName}</h1>
            <div className="text-blue-100 text-sm space-y-1">
              <p>{seller.address}</p>
              <p>GSTIN: {seller.gstin}</p>
              <p>Phone: {seller.mobile}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-6xl font-bold text-blue-100">₹</p>
            <p className="text-sm text-blue-100">INVOICE</p>
            <p className="text-2xl font-bold mt-2">{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8">
        {/* Invoice Meta */}
        <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b-2 border-gray-300">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">INVOICE DATE</p>
            <p className="text-lg font-bold">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">DUE DATE</p>
            <p className="text-lg font-bold">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm font-semibold mb-1">GST TYPE</p>
            <p className="text-lg font-bold text-blue-600">{invoice.gstType?.toUpperCase()}</p>
          </div>
        </div>

        {/* Billing & Shipping */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-gray-600 text-xs font-bold mb-3 tracking-wide">BILL TO</p>
            <p className="text-lg font-bold mb-1">{customerData.name}</p>
            <div className="text-gray-700 text-sm space-y-1">
              <p>{customerData.address}</p>
              <p>GSTIN: {customerData.gstin}</p>
              <p>Mobile: {customerData.mobile}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-xs font-bold mb-3 tracking-wide">SHIP TO</p>
            <p className="text-lg font-bold mb-1">{customerData.name}</p>
            <div className="text-gray-700 text-sm space-y-1">
              <p>{customerData.address}</p>
              <p>Mobile: {customerData.mobile}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead className="bg-blue-50 border-t-2 border-b-2 border-blue-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-blue-900 w-8">#</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-blue-900">Description</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-blue-900">HSN</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-blue-900">Qty</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-blue-900">Rate</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-blue-900">Amount</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-blue-900">GST %</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{item.hsnCode}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.rate)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">{formatCurrency(item.quantity * item.rate)}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{item.gstRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-gray-600 text-xs font-bold mb-3 tracking-wide">AMOUNT IN WORDS</p>
            <p className="text-gray-900 font-semibold italic">{amountInWords(Math.floor(invoice.grandTotal))}</p>
          </div>
          <div>
            <table className="w-full text-right">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 text-gray-700">Subtotal:</td>
                  <td className="px-4 py-2 font-semibold text-gray-900">{formatCurrency(invoice.subtotal || invoice.grandTotal)}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 text-gray-700">GST:</td>
                  <td className="px-4 py-2 font-semibold text-gray-900">{formatCurrency(invoice.totalGST || 0)}</td>
                </tr>
                <tr className="bg-blue-600 text-white font-bold text-lg">
                  <td className="px-4 py-3">Grand Total:</td>
                  <td className="px-4 py-3">{formatCurrency(invoice.grandTotal || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 grid grid-cols-2 gap-6 text-sm">
          <div className="text-center text-gray-700">
            <p className="font-bold text-gray-900 mb-2">Thank You!</p>
            <p>Please make payment on time</p>
            <p className="text-xs mt-2">{invoice.notes || 'Visit again'}</p>
          </div>
          <div className="text-right">
            <p className="mb-12 text-gray-600">_________________</p>
            <p className="font-bold text-gray-900">Authorized By</p>
            <p className="text-xs text-gray-600 mt-1">{seller.companyName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
