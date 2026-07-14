export const calculateCGST = (taxableAmount, gstRate) => {
  return (taxableAmount * gstRate) / 100 / 2;
};

export const calculateSGST = (taxableAmount, gstRate) => {
  return (taxableAmount * gstRate) / 100 / 2;
};

export const calculateIGST = (taxableAmount, gstRate) => {
  return (taxableAmount * gstRate) / 100;
};

export const calculateGSTAmount = (taxableAmount, gstRate) => {
  return (taxableAmount * gstRate) / 100;
};

export const calculateTaxableValue = (quantity, rate, discount = 0) => {
  return quantity * rate - (quantity * rate * discount) / 100;
};

export const calculateGrandTotal = (items, discount = 0, gstType = 'cgst+sgst') => {
  let subtotal = 0;
  let totalGst = 0;

  items.forEach(item => {
    const taxableAmount = item.taxableAmount;
    subtotal += taxableAmount;

    if (gstType === 'cgst+sgst') {
      totalGst += calculateCGST(taxableAmount, item.gstRate) * 2;
    } else if (gstType === 'igst') {
      totalGst += calculateIGST(taxableAmount, item.gstRate);
    }
  });

  const discountAmount = (subtotal * discount) / 100;
  return subtotal - discountAmount + totalGst;
};

export const calculateInvoiceTotals = (items, roundOff = 0, gstType = 'cgst+sgst') => {
  let subtotal = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const taxableAmount = item.taxableAmount;
    subtotal += taxableAmount;
    totalDiscount += item.discountAmount || 0;

    if (gstType === 'cgst+sgst') {
      const cgst = calculateCGST(taxableAmount, item.gstRate);
      const sgst = calculateSGST(taxableAmount, item.gstRate);
      totalCGST += cgst;
      totalSGST += sgst;
    } else if (gstType === 'igst') {
      totalIGST += calculateIGST(taxableAmount, item.gstRate);
    }
  });

  const totalGST = totalCGST + totalSGST + totalIGST;
  const grandTotal = subtotal + totalGST + roundOff;

  return {
    subtotal,
    totalDiscount,
    taxableValue: subtotal,
    totalCGST,
    totalSGST,
    totalIGST,
    totalGST,
    roundOff,
    grandTotal,
  };
};

export const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n) => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
  };

  if (num === 0) return 'Zero';
  return convert(Math.floor(num));
};

export const amountInWords = (amount) => {
  const [rupees, paise] = amount.toFixed(2).split('.');
  let words = numberToWords(parseInt(rupees)) + ' Rupees';
  if (parseInt(paise) > 0) {
    words += ' and ' + numberToWords(parseInt(paise)) + ' Paise';
  }
  return words;
};

// Generates the next plain invoice number: 1, 2, 3, etc.
// Older invoice formats are ignored so changing the format cannot create an
// unexpected jump in the new numeric sequence.
export const generateInvoiceNumber = (invoices = []) => {
  const highestNumber = invoices.reduce((highest, invoice) => {
    const value = String(invoice?.invoiceNumber ?? '').trim();
    return /^\d+$/.test(value) ? Math.max(highest, Number(value)) : highest;
  }, 0);

  return String(highestNumber + 1);
};
