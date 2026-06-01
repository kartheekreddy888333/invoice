import React, { useState, useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import Button from './Button';
import { useApp } from '../context/AppContext';
import InvoiceTemplate1 from './InvoiceTemplate1';
import InvoiceTemplate2 from './InvoiceTemplate2';
import InvoiceTemplate3 from './InvoiceTemplate3';
import TallyPrimeTemplate from './TallyPrimeTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TEMPLATES = [
  { id: 'tally-prime', name: 'Tally Prime Style', component: TallyPrimeTemplate },
  { id: 'classic', name: 'Classic Tally', component: InvoiceTemplate1 },
  { id: 'modern', name: 'Modern Business', component: InvoiceTemplate2 },
  { id: 'gst-detailed', name: 'GST Detailed', component: InvoiceTemplate3 },
];

export default function InvoicePreview({ invoice }) {
  const { company } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState('tally-prime');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const previewRef = useRef(null);

  const PDF_COPIES = [
    'Original for Recipient',
    'Duplicate for Transporter',
    'Triplicate for Supplier',
  ];

  const template = TEMPLATES.find(t => t.id === selectedTemplate);
  const TemplateComponent = template?.component;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const sourceElement = previewRef.current;
      const clone = sourceElement.cloneNode(true);

      clone.style.position = 'fixed';
      clone.style.left = '-10000px';
      clone.style.top = '0';
      clone.style.width = `${sourceElement.getBoundingClientRect().width}px`;
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';
      clone.style.backgroundColor = '#ffffff';

      document.body.appendChild(clone);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(clone);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const drawInvoiceImage = (targetPdf) => {
        const marginX = 8;
        const labelTop = 8;
        const labelHeight = 8;
        const contentTop = labelTop + labelHeight + 2;
        const contentWidth = pageWidth - marginX * 2;
        const contentHeight = pageHeight - contentTop - 8;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        targetPdf.setFontSize(11);
        targetPdf.setFont('helvetica', 'bold');
        targetPdf.setTextColor(30, 41, 59);

        if (imgHeight <= contentHeight) {
          const y = contentTop + ((contentHeight - imgHeight) / 2);
          targetPdf.addImage(canvas.toDataURL('image/png'), 'PNG', marginX, y, contentWidth, imgHeight);
          return;
        }

        const pageHeightPx = Math.floor((canvas.width * contentHeight) / contentWidth);
        let renderedHeight = 0;
        let pageIndex = 0;

        while (renderedHeight < canvas.height) {
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          const sliceHeight = Math.min(pageHeightPx, canvas.height - renderedHeight);

          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;

          if (pageCtx) {
            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            pageCtx.drawImage(
              canvas,
              0,
              renderedHeight,
              canvas.width,
              sliceHeight,
              0,
              0,
              canvas.width,
              sliceHeight
            );
          }

          const pageImgData = pageCanvas.toDataURL('image/png');
          const sliceHeightMm = (sliceHeight * contentWidth) / canvas.width;

          if (pageIndex > 0) {
            targetPdf.addPage();
          }

          targetPdf.addImage(pageImgData, 'PNG', marginX, contentTop, contentWidth, sliceHeightMm);

          renderedHeight += sliceHeight;
          pageIndex += 1;
        }
      };

      PDF_COPIES.forEach((copyLabel, copyIndex) => {
        if (copyIndex > 0) {
          pdf.addPage();
        }

        pdf.setFillColor(241, 245, 249);
        pdf.rect(8, 8, pageWidth - 16, 10, 'F');
        pdf.setDrawColor(148, 163, 184);
        pdf.rect(8, 8, pageWidth - 16, 10);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(15, 23, 42);
        pdf.text(copyLabel, pageWidth / 2, 14, { align: 'center' });

        drawInvoiceImage(pdf);
      }
      );

      pdf.save(`INV-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please check console for details.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!TemplateComponent) return null;

  return (
    <div className="space-y-4">
      {/* Template Selection & Actions */}
      <div className="flex gap-2 items-center print:hidden flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTemplate === t.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button 
            onClick={handleDownloadPDF} 
            icon={Download} 
            size="sm"
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button 
            onClick={handlePrint} 
            icon={Printer} 
            size="sm" 
            variant="secondary"
          >
            Print
          </Button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div 
        ref={previewRef}
        className="bg-white dark:bg-gray-900 print:bg-white rounded-lg overflow-auto print:overflow-hidden"
        style={{ minHeight: '800px', maxHeight: '85vh' }}
      >
        <TemplateComponent invoice={invoice} company={company || {}} />
      </div>
    </div>
  );
}
