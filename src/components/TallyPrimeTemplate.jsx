import React from 'react';
import { amountInWords } from '../utils/gstCalculations';

export default function TallyPrimeTemplate({ invoice, company }) {
  const {
    invoiceNumber,
    invoiceDate,
    customer,
    customerName,
    items = [],
    grandTotal = 0,
    totalGST = 0,
    paymentMode = 'Credit',
    notes = '',
    gstType = 'cgst+sgst'
  } = invoice || {};

  // Use customer object if available, otherwise create from customerName
  const customerData = customer || {
    name: customerName || 'Customer Name',
    address: customer?.address || 'Address',
    gstin: customer?.gstin || 'GSTIN',
    state: customer?.state || 'State',
    stateCode: customer?.stateCode || 'XX'
  };

  // Calculate tax components
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.rate;
    return sum + itemTotal;
  }, 0);

  const calculateTaxes = () => {
    let cgstTotal = 0, sgstTotal = 0, igstTotal = 0;
    items.forEach(item => {
      const taxableAmount = item.quantity * item.rate;
      const gstRate = item.gstRate || 0;
      
      const isIntraState = gstType === 'cgst+sgst' || gstType === 'intra_state';
      
      if (isIntraState) {
        cgstTotal += (taxableAmount * gstRate) / (2 * 100);
        sgstTotal += (taxableAmount * gstRate) / (2 * 100);
      } else {
        igstTotal += (taxableAmount * gstRate) / 100;
      }
    });
    return { cgstTotal, sgstTotal, igstTotal };
  };

  const taxes = calculateTaxes();

  return (
    <div className="bg-white p-4 md:p-8 print:p-4" style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      {/* Header Section */}
      <div className="border-b-2 border-gray-900 pb-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="w-1/3"></div>
          <div className="w-1/3 text-center">
            <h1 className="text-xl font-bold text-gray-900">TAX INVOICE</h1>
          </div>
          <div className="w-1/3 text-right">
            <p className="text-xs font-semibold text-gray-700">(ORIGINAL FOR RECIPIENT)</p>
          </div>
        </div>
      </div>

      {/* Seller and Invoice Details */}
      <div className="flex gap-4 mb-4">
        {/* Seller Details - Left */}
        <div className="w-1/2 text-xs border border-gray-400 p-3">
          <p className="font-bold text-sm mb-2">{company?.companyName || 'Company Name'}</p>
          <p className="text-xs text-gray-700">{company?.address || 'Address'}</p>
          <p className="text-xs text-gray-700">GSTIN/UIN: {company?.gstin || 'GSTIN'}</p>
          <p className="text-xs text-gray-700">State Name: {company?.state || 'State'}, Code: {company?.stateCode || 'XX'}</p>
          <p className="text-xs text-gray-700">Phone: {company?.mobile || 'Phone'}</p>
          <p className="text-xs text-gray-700">Email: {company?.email || 'Email'}</p>
        </div>

        {/* Invoice Details - Right */}
        <div className="w-1/2 text-xs border border-gray-400">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 w-1/2 bg-gray-100">Invoice No.</td>
                <td className="p-2 w-1/2">{invoiceNumber || 'INV-2026-0001'}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Dated</td>
                <td className="p-2">{invoiceDate || new Date().toLocaleDateString()}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Delivery Note</td>
                <td className="p-2">{invoice?.deliveryNote || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Mode/Terms of Payment</td>
                <td className="p-2">{paymentMode}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Reference No. & Date</td>
                <td className="p-2">{invoice?.referenceNo || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Other References</td>
                <td className="p-2">{invoice?.otherReferences || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Buyer's Order No.</td>
                <td className="p-2">{invoice?.buyerOrderNo || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Dispatch Doc No.</td>
                <td className="p-2">{invoice?.dispatchDocNo || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Delivery Note Date</td>
                <td className="p-2">{invoice?.deliveryNoteDate || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Dispatched Through</td>
                <td className="p-2">{invoice?.dispatchedThrough || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Destination</td>
                <td className="p-2">{invoice?.destination || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Vehicle Number</td>
                <td className="p-2">{invoice?.vehicleNumber || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Bill Of Lading/LR-RR No.</td>
                <td className="p-2">{invoice?.billOfLading || ''}</td>
              </tr>
              <tr>
                <td className="font-semibold p-2 bg-gray-100">Terms Of Delivery</td>
                <td className="p-2">{invoice?.termsOfDelivery || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details */}
      <div className="flex gap-4 mb-4">
        {/* Consignee */}
        <div className="w-1/2 text-xs border border-gray-400 p-3">
          <p className="font-bold mb-2">Consignee (Ship To)</p>
          <p className="font-semibold">{customerData.name || 'Customer Name'}</p>
          <p className="text-gray-700">{customerData.address || 'Address'}</p>
          <p className="text-gray-700">GSTIN/UIN: {customerData.gstin || 'GSTIN'}</p>
          <p className="text-gray-700">State Name: {customerData.state || 'State'}, Code: {customerData.stateCode || 'XX'}</p>
        </div>

        {/* Buyer */}
        <div className="w-1/2 text-xs border border-gray-400 p-3">
          <p className="font-bold mb-2">Buyer (Bill To)</p>
          <p className="font-semibold">{customerData.name || 'Customer Name'}</p>
          <p className="text-gray-700">{customerData.address || 'Address'}</p>
          <p className="text-gray-700">GSTIN/UIN: {customerData.gstin || 'GSTIN'}</p>
          <p className="text-gray-700">State Name: {customerData.state || 'State'}, Code: {customerData.stateCode || 'XX'}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-xs border-collapse mb-4 border border-gray-400">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-400">
            <th className="border border-gray-400 p-1 text-left">Sl No</th>
            <th className="border border-gray-400 p-1 text-left">Description of Goods</th>
            <th className="border border-gray-400 p-1 text-center">HSN/SAC</th>
            <th className="border border-gray-400 p-1 text-center">Quantity</th>
            <th className="border border-gray-400 p-1 text-center">Unit</th>
            <th className="border border-gray-400 p-1 text-right">Rate incl. of Tax</th>
            <th className="border border-gray-400 p-1 text-right">Rate excl. of Tax</th>
            <th className="border border-gray-400 p-1 text-center">GST %</th>
            {(gstType === 'cgst+sgst' || gstType === 'intra_state') ? (
              <>
                <th className="border border-gray-400 p-1 text-center">CGST %</th>
                <th className="border border-gray-400 p-1 text-center">SGST %</th>
              </>
            ) : (
              <th className="border border-gray-400 p-1 text-center">IGST %</th>
            )}
            <th className="border border-gray-400 p-1 text-right">Tax Amount</th>
            <th className="border border-gray-400 p-1 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const itemSubtotal = item.quantity * item.rate;
            const gstRate = item.gstRate || 0;
            const isIntraState = gstType === 'cgst+sgst' || gstType === 'intra_state';
            const cgstRate = isIntraState ? gstRate / 2 : 0;
            const sgstRate = isIntraState ? gstRate / 2 : 0;
            const igstRate = !isIntraState ? gstRate : 0;
            const taxAmount = (itemSubtotal * gstRate) / 100;

            return (
              <tr key={index} className="border-b border-gray-400">
                <td className="border border-gray-400 p-1 text-center">{index + 1}</td>
                <td className="border border-gray-400 p-1">{item.productName || item.name || 'Product'}</td>
                <td className="border border-gray-400 p-1 text-center">{item.hsnCode || '00000000'}</td>
                <td className="border border-gray-400 p-1 text-center">{item.quantity}</td>
                <td className="border border-gray-400 p-1 text-center">{item.unit || 'kg'}</td>
                <td className="border border-gray-400 p-1 text-right">₹{(itemSubtotal + taxAmount).toFixed(2)}</td>
                <td className="border border-gray-400 p-1 text-right">₹{itemSubtotal.toFixed(2)}</td>
                <td className="border border-gray-400 p-1 text-center">{gstRate}%</td>
                {isIntraState ? (
                  <>
                    <td className="border border-gray-400 p-1 text-center">{cgstRate}%</td>
                    <td className="border border-gray-400 p-1 text-center">{sgstRate}%</td>
                  </>
                ) : (
                  <td className="border border-gray-400 p-1 text-center">{igstRate}%</td>
                )}
                <td className="border border-gray-400 p-1 text-right">₹{taxAmount.toFixed(2)}</td>
                <td className="border border-gray-400 p-1 text-right">₹{(itemSubtotal + taxAmount).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Tax Summary Section */}
      <div className="flex gap-4 mb-4">
        {/* Left empty space */}
        <div className="w-1/2"></div>

        {/* Tax Summary - Right */}
        <div className="w-1/2 text-xs border border-gray-400">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 w-2/3 bg-gray-100">Taxable Value</td>
                <td className="p-2 text-right w-1/3">₹{subtotal.toFixed(2)}</td>
              </tr>
              {(gstType === 'cgst+sgst' || gstType === 'intra_state') ? (
                <>
                  <tr className="border-b border-gray-400">
                    <td className="font-semibold p-2 bg-gray-100">CGST Total</td>
                    <td className="p-2 text-right">₹{taxes.cgstTotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-400">
                    <td className="font-semibold p-2 bg-gray-100">SGST Total</td>
                    <td className="p-2 text-right">₹{taxes.sgstTotal.toFixed(2)}</td>
                  </tr>
                </>
              ) : (
                <tr className="border-b border-gray-400">
                  <td className="font-semibold p-2 bg-gray-100">IGST Total</td>
                  <td className="p-2 text-right">₹{taxes.igstTotal.toFixed(2)}</td>
                </tr>
              )}
              <tr className="border-b-2 border-gray-900">
                <td className="font-bold p-2 bg-gray-100">Grand Total</td>
                <td className="p-2 text-right font-bold">₹{grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="border border-gray-400 p-3 mb-4 text-xs">
        <p className="font-semibold">
          Amount in Words: <span className="font-normal">{amountInWords(grandTotal)} Only</span>
        </p>
      </div>

      {/* Bank Details Section */}
      <div className="flex gap-4 mb-4">
        <div className="w-1/2 text-xs border border-gray-400 p-3">
          <p className="font-bold mb-2">Bank Details:</p>
          <p><strong>Bank Name:</strong> {company?.bankName || 'Bank Name'}</p>
          <p><strong>Account No:</strong> {company?.accountNumber || 'Account Number'}</p>
          <p><strong>IFSC:</strong> {company?.ifscCode || 'IFSC Code'}</p>
          <p><strong>Branch:</strong> {company?.branch || 'Branch'}</p>
          <p><strong>UPI:</strong> {company?.upiId || 'UPI ID'}</p>
        </div>

        {/* Signature Section */}
        <div className="w-1/2 text-xs border border-gray-400 p-3 flex flex-col justify-between">
          <div>
            <p className="font-semibold mb-6">Authorized Signatory</p>
            <div className="border-t border-gray-400 pt-2 text-center h-16"></div>
            <p className="text-center text-xs mt-2">{company?.companyName || 'Company Name'}</p>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="text-xs border border-gray-400 p-3 mb-4">
        <p className="font-semibold mb-1">Terms & Conditions:</p>
        <p className="text-gray-700">{notes || 'Subject to Jurisdiction of Courts in (City). This is a computer generated invoice.'}</p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
