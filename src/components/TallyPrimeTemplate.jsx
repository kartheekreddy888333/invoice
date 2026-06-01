// @ts-nocheck
import React from 'react';
import { amountInWords } from '../utils/gstCalculations';

export default function TallyPrimeTemplate({ invoice, company = {} }) {
  if (!invoice) return null;

  const seller = {
    companyName: 'Company Name',
    address: 'Address',
    gstin: 'GSTIN',
    state: 'State',
    stateCode: 'XX',
    mobile: 'Phone',
    email: 'Email',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    ifscCode: 'IFSC Code',
    upiId: 'UPI ID',
    ...company,
  };

  const customerData = {
    name: invoice.customer?.name || invoice.customer?.customerName || invoice.customerName || 'Customer Name',
    address: invoice.customer?.address || invoice.customerAddress || 'Address',
    gstin: invoice.customer?.gstin || invoice.customerGstin || 'GSTIN',
    mobile: invoice.customer?.mobile || invoice.customer?.mobileNumber || invoice.customerMobile || 'N/A',
    state: invoice.customer?.state || invoice.customerState || 'State',
    stateCode: invoice.customer?.stateCode || invoice.customerStateCode || 'XX',
  };

  const {
    invoiceNumber,
    invoiceDate,
    items = [],
    grandTotal = 0,
    paymentMode = 'Credit',
    notes = '',
    gstType = 'cgst+sgst',
  } = invoice;

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  const calculateTaxes = () => {
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    items.forEach(item => {
      const taxableAmount = item.quantity * item.rate;
      const gstRate = item.gstRate || 0;
      const isIntraState = gstType === 'cgst+sgst' || gstType === 'intra_state';

      if (isIntraState) {
        cgstTotal += (taxableAmount * gstRate) / 200;
        sgstTotal += (taxableAmount * gstRate) / 200;
      } else {
        igstTotal += (taxableAmount * gstRate) / 100;
      }
    });

    return { cgstTotal, sgstTotal, igstTotal };
  };

  const taxes = calculateTaxes();

  return (
    <div className="bg-white p-2 md:p-4 print:p-2" style={{ width: '100%', maxWidth: '210mm', margin: '0 auto' }}>
      <div className="border-b-2 border-gray-900 pb-2 mb-2">
        <div className="flex justify-center items-center mb-2">
          <h1 className="text-lg font-bold text-gray-900">TAX INVOICE</h1>
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="w-1/2 text-xs border border-gray-400 p-2">
          <p className="font-bold text-sm mb-1">{seller.companyName}</p>
          <p className="text-xs text-gray-700">{seller.address}</p>
          <p className="text-xs text-gray-700">GSTIN/UIN: {seller.gstin}</p>
          <p className="text-xs text-gray-700">State Name: {seller.state}, Code: {seller.stateCode}</p>
          <p className="text-xs text-gray-700">Phone: {seller.mobile}</p>
          <p className="text-xs text-gray-700">Email: {seller.email}</p>
        </div>

        <div className="w-1/2 text-xs border border-gray-400">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 w-1/2 bg-gray-100">Invoice No.</td>
                <td className="p-2 w-1/2">{invoiceNumber || 'INV-2026-0001'}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Dated</td>
                <td className="p-2">{invoiceDate || new Date().toISOString().split('T')[0]}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Delivery Note</td>
                <td className="p-2">{invoice.deliveryNote || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Mode/Terms of Payment</td>
                <td className="p-2">{paymentMode}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Reference No. & Date</td>
                <td className="p-2">{invoice.referenceNo || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Other References</td>
                <td className="p-2">{invoice.otherReferences || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Buyer's Order No.</td>
                <td className="p-2">{invoice.buyerOrderNo || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Dispatch Doc No.</td>
                <td className="p-2">{invoice.dispatchDocNo || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Delivery Note Date</td>
                <td className="p-2">{invoice.deliveryNoteDate || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Dispatched Through</td>
                <td className="p-2">{invoice.dispatchedThrough || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Destination</td>
                <td className="p-2">{invoice.destination || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Vehicle Number</td>
                <td className="p-2">{invoice.vehicleNumber || ''}</td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="font-semibold p-2 bg-gray-100">Bill Of Lading/LR-RR No.</td>
                <td className="p-2">{invoice.billOfLading || ''}</td>
              </tr>
              <tr>
                <td className="font-semibold p-2 bg-gray-100">Terms Of Delivery</td>
                <td className="p-2">{invoice.termsOfDelivery || ''}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="w-1/2 text-xs border border-gray-400 p-2">
          <p className="font-bold mb-1">Consignee (Ship To)</p>
          <p className="font-semibold">{customerData.name}</p>
          <p className="text-gray-700">{customerData.address}</p>
          <p className="text-gray-700">GSTIN/UIN: {customerData.gstin}</p>
          <p className="text-gray-700">Mobile: {customerData.mobile}</p>
          <p className="text-gray-700">State Name: {customerData.state}, Code: {customerData.stateCode}</p>
        </div>

        <div className="w-1/2 text-xs border border-gray-400 p-3">
          <p className="font-bold mb-2">Buyer (Bill To)</p>
          <p className="font-semibold">{customerData.name}</p>
          <p className="text-gray-700">{customerData.address}</p>
          <p className="text-gray-700">GSTIN/UIN: {customerData.gstin}</p>
          <p className="text-gray-700">Mobile: {customerData.mobile}</p>
          <p className="text-gray-700">State Name: {customerData.state}, Code: {customerData.stateCode}</p>
        </div>
      </div>

      <table className="w-full text-xs border-collapse mb-2 border border-gray-400">
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

      <div className="flex gap-2 mb-2">
        <div className="w-1/2"></div>
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

      <div className="border border-gray-400 p-2 mb-2 text-xs">
        <p className="font-semibold">
          Amount in Words: <span className="font-normal">{amountInWords(grandTotal)} Only</span>
        </p>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="w-1/2 text-xs border border-gray-400 p-2">
          <p className="font-bold mb-1">Bank Details:</p>
          <div><strong>Bank Name:</strong> {seller.bankName}</div>
          <div><strong>Account No:</strong> {seller.accountNumber}</div>
          <div><strong>IFSC:</strong> {seller.ifscCode}</div>
          <div><strong>UPI:</strong> {seller.upiId}</div>
        </div>

        <div className="w-1/2 text-xs border border-gray-400 p-2 flex flex-col justify-between">
          <div>
            <p className="font-semibold mb-2">Authorized Signatory</p>
            <div className="border-t border-gray-400 pt-1 text-center h-8"></div>
            <p className="text-center text-xs mt-2">For {seller.companyName}</p>
          </div>
        </div>
      </div>

      <div className="text-xs border border-gray-400 p-2">
        <p className="font-semibold mb-0.5">Terms & Conditions:</p>
        <p className="text-gray-700">{notes || 'Subject to Jurisdiction of Courts in (City). This is a computer generated invoice.'}</p>
      </div>

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
