
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "@/lib/utils/superbill-utils";
import { generatePrintableHTML } from "@/lib/utils/html-generator";

interface DownloadButtonProps {
  superbill: Superbill;
  coverLetterContent?: string;
}

export function DownloadButton({ superbill, coverLetterContent }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    setIsGenerating(true);
    toast({
      title: "PDF Download",
      description: "Preparing PDF download...",
    });
    
    try {
      // Create a temporary container with exact print dimensions
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-10000px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width at 96 DPI
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';
      tempContainer.style.padding = '40px';
      tempContainer.style.boxSizing = 'border-box';
      
      // Enhanced CSS for better pagination and spacing
      const enhancedCSS = `
        <style>
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
            margin: 0;
            padding: 0;
          }
          
          .container {
            width: 100%;
            max-width: 714px; /* Account for margins */
          }
          
          /* Cover letter page break */
          .cover-letter {
            page-break-after: always;
            margin-bottom: 0;
            padding-bottom: 20px;
          }
          
          /* Header styling */
          .header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
            page-break-inside: avoid;
          }
          
          .header h1 {
            font-size: 20px;
            margin: 0;
            text-align: center;
            font-weight: bold;
          }
          
          /* Info section - prevent breaking */
          .info-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          
          .info-block {
            margin-bottom: 15px;
            width: 48%;
            display: inline-block;
            vertical-align: top;
          }
          
          .info-block:first-child {
            margin-right: 4%;
          }
          
          .info-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #ccc;
          }
          
          .info-block p {
            margin: 2px 0;
            font-size: 11px;
          }
          
          /* Services section with page break control */
          .services-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          
          .services-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #ccc;
            page-break-after: avoid;
          }
          
          /* Table with enhanced pagination */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 10px;
            page-break-inside: auto;
          }
          
          thead {
            display: table-header-group;
            page-break-inside: avoid;
            page-break-after: avoid;
          }
          
          tbody {
            display: table-row-group;
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          th, td {
            border: 1px solid #333;
            padding: 6px 4px;
            text-align: left;
            font-size: 10px;
          }
          
          th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 11px;
          }
          
          .total-row {
            font-weight: bold;
            background-color: #f5f5f5;
            font-size: 11px;
            page-break-inside: avoid;
          }
          
          /* Notes section with page break control */
          .notes-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          
          .notes-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #ccc;
            page-break-after: avoid;
          }
          
          .notes {
            border: 1px solid #ccc;
            padding: 10px;
            min-height: 30px;
            background-color: #fafafa;
            page-break-inside: avoid;
          }
          
          /* Footer */
          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            font-size: 9px;
            text-align: center;
            page-break-inside: avoid;
          }
          
          /* Paragraph and list styling */
          p {
            margin: 0 0 4px 0;
          }
          
          ol, ul {
            margin: 6px 0;
            padding-left: 20px;
          }
          
          ol li, ul li {
            margin-bottom: 4px;
            line-height: 1.2;
          }
          
          /* Strong text */
          strong {
            font-weight: bold;
          }
          
          /* Prevent orphaned headers */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            margin: 6px 0;
            line-height: 1.2;
          }
          
          /* Specific spacing adjustments */
          .no-break {
            page-break-inside: avoid;
          }
          
          /* Reduce excessive white space */
          * {
            box-sizing: border-box;
          }
        </style>
      `;
      
      // Generate and insert the HTML content with enhanced CSS
      const htmlContent = generatePrintableHTML(superbill, coverLetterContent);
      
      // Wrap content with enhanced CSS
      const wrappedContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Superbill</title>
          ${enhancedCSS}
        </head>
        <body>
          ${htmlContent.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/, '').replace(/<\/body>[\s\S]*?<\/html>/, '')}
        </body>
        </html>
      `;
      
      tempContainer.innerHTML = wrappedContent;
      document.body.appendChild(tempContainer);
      
      // Wait for fonts and content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force a layout recalculation
      tempContainer.offsetHeight;
      
      // Use html2canvas with optimized settings
      const canvas = await html2canvas(tempContainer, {
        scale: 2.5, // High quality but manageable file size
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: tempContainer.scrollHeight,
        logging: false,
        foreignObjectRendering: false,
        removeContainer: false,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has proper styling
          const clonedContainer = clonedDoc.querySelector('div');
          if (clonedContainer) {
            clonedContainer.style.position = 'static';
            clonedContainer.style.left = 'auto';
            clonedContainer.style.width = '794px';
            clonedContainer.style.fontFamily = 'Arial, sans-serif';
            clonedContainer.style.fontSize = '12px';
            clonedContainer.style.lineHeight = '1.4';
            clonedContainer.style.color = '#000000';
            clonedContainer.style.backgroundColor = '#ffffff';
            
            // Ensure all text elements have proper anti-aliasing
            const allElements = clonedContainer.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style) {
                el.style.webkitFontSmoothing = 'antialiased';
                el.style.mozOsxFontSmoothing = 'grayscale';
                el.style.textRendering = 'optimizeLegibility';
              }
            });
          }
        }
      });
      
      // Clean up the temporary container
      document.body.removeChild(tempContainer);
      
      // Create PDF with optimized pagination
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
        precision: 2
      });
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 12.7; // 0.5 inch margins
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      // Calculate scaling to fit content properly
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Add pages with proper pagination
      let remainingHeight = imgHeight;
      let yPosition = 0;
      let pageCount = 0;
      
      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        const currentPageHeight = Math.min(remainingHeight, contentHeight);
        
        // Add image with margins
        pdf.addImage(
          canvas.toDataURL('image/png', 1.0), // Use PNG for better text quality
          'PNG',
          margin,
          margin + yPosition,
          imgWidth,
          imgHeight,
          undefined,
          'MEDIUM'
        );
        
        remainingHeight -= contentHeight;
        yPosition -= contentHeight;
        pageCount++;
        
        // Prevent infinite loops
        if (pageCount > 20) break;
      }
      
      // Generate filename and save
      const fileName = `Superbill-${superbill.patientName.replace(/\s+/g, "-")}-${formatDate(superbill.issueDate)}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "PDF Downloaded",
        description: "Your superbill has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleDownload} 
      disabled={isGenerating}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  );
}
