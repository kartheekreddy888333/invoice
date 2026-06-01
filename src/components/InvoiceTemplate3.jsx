import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { amountInWords } from '../utils/gstCalculations';

export default function InvoiceTemplate3({ invoice, company = {} }) {
  if (!invoice) return null;

  const seller = {
    companyName: 'Company Name',
    address: 'Address',
    gstin: 'XX AAXXXXXXXXX X',
    mobile: '(XXX) XXX-XXXX',
    email: 'email@company.com',
    state: 'State',
    stateCode: 'XX',
    bankName: 'Bank Name',
    accountNumber: 'XXXXX',
    ifscCode: 'XXXXX',
    branch: 'Branch',
    upiId: 'N/A',
    ...company,
  };

  const customerData = {
    name: invoice.customer?.name || invoice.customer?.customerName || invoice.customerName || 'Customer Name',
    address: invoice.customer?.address || invoice.customerAddress || 'Address',
    gstin: invoice.customer?.gstin || invoice.customerGstin || 'N/A',
    mobile: invoice.customer?.mobile || invoice.customer?.mobileNumber || invoice.customerMobile || 'N/A',
    state: invoice.customer?.state || invoice.customerState || 'State',
    stateCode: invoice.customer?.stateCode || invoice.customerStateCode || 'XX',
  };

  const items = invoice.items || [];
  
  const calculateItemGST = (item) => {
    const amount = item.quantity * item.rate;
    const gstAmount = (amount * (item.gstRate || 0)) / 100;
    if (invoice.gstType === 'cgst+sgst') {
      return { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0 };
    } else if (invoice.gstType === 'igst') {
      return { cgst: 0, sgst: 0, igst: gstAmount };
    }
    return { cgst: 0, sgst: 0, igst: 0 };
  };

  const getTotals = () => {
    let cgstTotal = 0, sgstTotal = 0, igstTotal = 0, subtotal = 0;
    items.forEach(item => {
      const amount = item.quantity * item.rate;
      subtotal += amount;
      const gst = calculateItemGST(item);
      cgstTotal += gst.cgst;
      sgstTotal += gst.sgst;
      igstTotal += gst.igst;
    });
    const totalGst = cgstTotal + sgstTotal + igstTotal;
    const grandTotal = subtotal + totalGst;
    return { subtotal, cgstTotal, sgstTotal, igstTotal, totalGst, grandTotal };
  };

  const totals = getTotals();

  return (
    <div className="bg-white p-8 text-gray-900 font-sans">
      {/* Header */}
      <div className="border-b-4 border-gray-900 pb-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-black mb-1">{seller.companyName}</h1>
            <div className="border-l-4 border-blue-600 pl-3 text-xs space-y-0.5">
              <p>{seller.address}</p>
              <p className="font-bold">GSTIN: {seller.gstin}</p>
              <p>Phone: {seller.mobile} | Email: {seller.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-blue-600 mb-1">TAX INVOICE</p>
            <p className="text-xs text-gray-600">Original for Recipient</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-4 gap-4 mb-6 text-xs border border-gray-400 p-3">
        <div>
          <p className="font-bold text-gray-600">Invoice No.</p>
          <p className="font-bold text-lg">{invoice.invoiceNumber}</p>
        </div>
        <div>
          <p className="font-bold text-gray-600">Date</p>
          <p className="font-bold">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</p>
        </div>
        <div>
          <p className="font-bold text-gray-600">Due Date</p>
          <p className="font-bold">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
        </div>
        <div>
          <p className="font-bold text-gray-600">Place of Supply</p>
          <p className="font-bold">{company.state || 'State'}</p>
        </div>
      </div>

      {/* Billing Details */}
      <div className="grid grid-cols-2 gap-6 mb-6 text-xs border-l-4 border-blue-600 pl-4">
        <div>
          <p className="font-black text-gray-700 mb-2">BILL TO:</p>
          <p className="font-bold text-sm mb-1">{customerData.name}</p>
          <p>{customerData.address}</p>
          <p className="font-bold mt-2">GSTIN: {customerData.gstin}</p>
          <p>Mobile: {customerData.mobile}</p>
        </div>
        <div>
          <p className="font-black text-gray-700 mb-2">SHIP TO:</p>
          <p className="font-bold text-sm mb-1">{customerData.name}</p>
          <p>{customerData.address}</p>
          <p className="font-bold mt-2">State: {customerData.state}</p>
        </div>
      </div>

      {/* Items Table with Detailed GST */}
      <table className="w-full mb-4 text-xs border-collapse border border-gray-800">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="border border-gray-800 px-2 py-2 text-center w-8">#</th>
            <th className="border border-gray-800 px-2 py-2 text-left">Product Description</th>
            <th className="border border-gray-800 px-2 py-2 text-center">HSN/SAC</th>
            <th className="border border-gray-800 px-2 py-2 text-right">Qty</th>
            <th className="border border-gray-800 px-2 py-2 text-right">Unit</th>
            <th className="border border-gray-800 px-2 py-2 text-right">Rate</th>
            <th className="border border-gray-800 px-2 py-2 text-right">Taxable</th>
            <th className="border border-gray-800 px-2 py-2 text-center">GST %</th>
            {invoice.gstType === 'cgst+sgst' && (
              <>
                <th className="border border-gray-800 px-2 py-2 text-right">CGST</th>
                <th className="border border-gray-800 px-2 py-2 text-right">SGST</th>
              </>
            )}
            {invoice.gstType === 'igst' && (
              <th className="border border-gray-800 px-2 py-2 text-right">IGST</th>
            )}
            <th className="border border-gray-800 px-2 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const amount = item.quantity * item.rate;
            const gst = calculateItemGST(item);
            const total = amount + gst.cgst + gst.sgst + gst.igst;
            return (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="border border-gray-800 px-2 py-2 text-center">{idx + 1}</td>
                <td className="border border-gray-800 px-2 py-2 font-semibold">{item.productName}</td>
                <td className="border border-gray-800 px-2 py-2 text-center font-mono">{item.hsnCode}</td>
                <td className="border border-gray-800 px-2 py-2 text-right">{item.quantity}</td>
                <td className="border border-gray-800 px-2 py-2 text-center">{item.unit}</td>
                <td className="border border-gray-800 px-2 py-2 text-right">{formatCurrency(item.rate)}</td>
                <td className="border border-gray-800 px-2 py-2 text-right font-semibold">{formatCurrency(amount)}</td>
                <td className="border border-gray-800 px-2 py-2 text-center font-bold">{item.gstRate}%</td>
                {invoice.gstType === 'cgst+sgst' && (
                  <>
                    <td className="border border-gray-800 px-2 py-2 text-right">{formatCurrency(gst.cgst)}</td>
                    <td className="border border-gray-800 px-2 py-2 text-right">{formatCurrency(gst.sgst)}</td>
                  </>
                )}
                {invoice.gstType === 'igst' && (
                  <td className="border border-gray-800 px-2 py-2 text-right">{formatCurrency(gst.igst)}</td>
                )}
                <td className="border border-gray-800 px-2 py-2 text-right font-bold">{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-xs">
          <p className="font-bold text-gray-700 mb-2">AMOUNT IN WORDS:</p>
          <p className="border border-gray-400 p-2 italic bg-gray-50 font-semibold">
            {amountInWords(Math.floor(totals.grandTotal))}
          </p>
        </div>
        <table className="w-full text-xs">
          <tbody>
            <tr className="border border-gray-400">
              <td className="px-3 py-2 text-right font-semibold">Subtotal:</td>
              <td className="px-3 py-2 text-right font-bold">{formatCurrency(totals.subtotal)}</td>
            </tr>
            {invoice.gstType === 'cgst+sgst' && (
              <>
                <tr className="border border-gray-400 bg-blue-50">
                  <td className="px-3 py-2 text-right font-semibold">CGST ({items[0]?.gstRate || 0}%):</td>
                  <td className="px-3 py-2 text-right font-bold">{formatCurrency(totals.cgstTotal)}</td>
                </tr>
                <tr className="border border-gray-400 bg-blue-50">
                  <td className="px-3 py-2 text-right font-semibold">SGST ({items[0]?.gstRate || 0}%):</td>
                  <td className="px-3 py-2 text-right font-bold">{formatCurrency(totals.sgstTotal)}</td>
                </tr>
              </>
            )}
            {invoice.gstType === 'igst' && (
              <tr className="border border-gray-400 bg-blue-50">
                <td className="px-3 py-2 text-right font-semibold">IGST ({items[0]?.gstRate || 0}%):</td>
                <td className="px-3 py-2 text-right font-bold">{formatCurrency(totals.igstTotal)}</td>
              </tr>
            )}
            <tr className="bg-gray-900 text-white font-bold text-sm">
              <td className="px-3 py-3 text-right">GRAND TOTAL:</td>
              <td className="px-3 py-3 text-right">{formatCurrency(totals.grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-gray-900 pt-4 grid grid-cols-3 gap-4 text-xs">
        <div>
          <p className="font-bold mb-2">Bank Details:</p>
           <div><strong>Bank Name:</strong> {seller.bankName}</div>
           <div><strong>Account No:</strong> {seller.accountNumber}</div>
           <div><strong>IFSC:</strong> {seller.ifscCode}</div>
           <div><strong>Branch:</strong> {seller.branch}</div>
           <div><strong>UPI:</strong> {seller.upiId}</div>
        </div>
        <div className="text-center">
          <p className="font-bold mb-2">Declaration:</p>
          <p className="text-gray-700 text-xs">{invoice.notes || 'We declare that this invoice shows the actual price of the goods/services described and that all particulars have been truly and correctly shown.'}</p>
        </div>
        <div className="text-right">
          <p className="mb-6">_________________</p>
            <p className="font-bold">For {seller.companyName}</p>
          <p className="text-gray-600 text-xs mt-1">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
}
