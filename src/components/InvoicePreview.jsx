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

  const template = TEMPLATES.find(t => t.id === selectedTemplate);
  const TemplateComponent = template?.component;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const element = previewRef.current.querySelector('.bg-white');
      if (!element) {
        alert('Invoice content not found');
        setIsGeneratingPDF(false);
        return;
      }

      // Get the actual content div
      const contentDiv = element.querySelector('div') || element;
      
      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Handle multi-page PDFs
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

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
