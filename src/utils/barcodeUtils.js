import JsBarcode from 'jsbarcode';

export function generateBarcode(value, format = 'CODE128') {
  const canvas = document.createElement('canvas');
  try {
    JsBarcode(canvas, value, {
      format: format,
      width: 2,
      height: 100,
      displayValue: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Barcode generation error:', error);
    return null;
  }
}

export function downloadBarcode(value, filename) {
  const barcodeData = generateBarcode(value);
  if (barcodeData) {
    const link = document.createElement('a');
    link.href = barcodeData;
    link.download = `${filename || value}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function printBarcode(value) {
  const barcodeData = generateBarcode(value);
  if (barcodeData) {
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write(`
      <html>
        <head><title>Barcode</title></head>
        <body onload="window.print();window.close();">
          <img src="${barcodeData}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
