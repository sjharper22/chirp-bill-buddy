import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { useState } from "react";
import { jsPDF } from "jspdf";
import { formatDate, formatCurrency } from "@/lib/utils/superbill-utils";

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
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;
      
      // Set font
      pdf.setFont("helvetica");
      
      // Helper function to add new page if needed
      const checkPageBreak = (neededHeight: number, forceBreak = false) => {
        if (currentY + neededHeight > pageHeight - margin || forceBreak) {
          pdf.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };
      
      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, options: any = {}) => {
        const fontSize = options.fontSize || 10;
        const maxWidth = options.maxWidth || contentWidth;
        const lineHeight = options.lineHeight || fontSize * 0.35;
        const align = options.align || 'left';
        
        pdf.setFontSize(fontSize);
        if (options.bold) pdf.setFont("helvetica", "bold");
        else pdf.setFont("helvetica", "normal");
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string, index: number) => {
          const lineY = y + (index * lineHeight);
          if (lineY > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
            return margin + (index * lineHeight);
          }
          
          let lineX = x;
          if (align === 'center') {
            lineX = x - (pdf.getTextWidth(line) / 2);
          } else if (align === 'right') {
            lineX = x - pdf.getTextWidth(line);
          }
          
          pdf.text(line, lineX, lineY);
        });
        
        return y + (lines.length * lineHeight);
      };
      
      // Add cover letter if provided
      if (coverLetterContent && coverLetterContent.trim()) {
        // Strip HTML tags for plain text
        const plainText = coverLetterContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
        
        currentY = addText(plainText, margin, currentY, {
          fontSize: 11,
          maxWidth: contentWidth,
          lineHeight: 4
        });
        
        // Force page break after cover letter
        checkPageBreak(0, true);
      }
      
      // SUPERBILL HEADER
      currentY = addText("SUPERBILL", pageWidth / 2, currentY, {
        fontSize: 18,
        bold: true,
        align: 'center'
      });
      currentY += 15;
      
      // Check page break before patient info (ensure we have space for both boxes)
      checkPageBreak(45);
      
      // PATIENT INFORMATION SECTION
      const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
      const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
      const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
      
      // Patient Info Box
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, currentY, contentWidth / 2 - 5, 35);
      
      currentY += 5;
      currentY = addText("PATIENT INFORMATION", margin + 2, currentY, {
        fontSize: 12,
        bold: true
      });
      currentY += 2;
      
      currentY = addText(`Name: ${superbill.patientName}`, margin + 2, currentY, {
        fontSize: 10
      });
      currentY += 4;
      
      currentY = addText(`DOB: ${formatDate(superbill.patientDob)}`, margin + 2, currentY, {
        fontSize: 10
      });
      currentY += 4;
      
      currentY = addText(`Date: ${formatDate(superbill.issueDate)}`, margin + 2, currentY, {
        fontSize: 10
      });
      currentY += 4;
      
      if (visitDates.length > 0) {
        currentY = addText(`Visit Period: ${formatDate(earliestDate)} to ${formatDate(latestDate)}`, margin + 2, currentY, {
          fontSize: 10
        });
      }
      
      // Provider Info Box (right side)
      const providerX = margin + contentWidth / 2 + 5;
      pdf.rect(providerX, currentY - 23, contentWidth / 2 - 5, 35);
      
      let providerY = currentY - 18;
      providerY = addText("PROVIDER INFORMATION", providerX + 2, providerY, {
        fontSize: 12,
        bold: true
      });
      providerY += 2;
      
      providerY = addText(`Provider: ${superbill.providerName}`, providerX + 2, providerY, {
        fontSize: 10
      });
      providerY += 4;
      
      providerY = addText(superbill.clinicName, providerX + 2, providerY, {
        fontSize: 10
      });
      providerY += 4;
      
      providerY = addText(superbill.clinicAddress, providerX + 2, providerY, {
        fontSize: 10
      });
      providerY += 4;
      
      providerY = addText(`Phone: ${superbill.clinicPhone}`, providerX + 2, providerY, {
        fontSize: 10
      });
      providerY += 4;
      
      providerY = addText(`Email: ${superbill.clinicEmail}`, providerX + 2, providerY, {
        fontSize: 10
      });
      providerY += 4;
      
      providerY = addText(`EIN: ${superbill.ein}`, providerX + 2, providerY, {
        fontSize: 10
      });
      providerY += 4;
      
      providerY = addText(`NPI #: ${superbill.npi}`, providerX + 2, providerY, {
        fontSize: 10
      });
      
      currentY += 20;
      
      // SERVICES TABLE
      // Check if we have enough space for table header + at least 2 rows
      const tableHeaderHeight = 15;
      const rowHeight = 8;
      const minTableSpace = tableHeaderHeight + (rowHeight * Math.min(3, superbill.visits.length + 1)); // header + 2 data rows + total
      
      checkPageBreak(minTableSpace);
      
      currentY = addText("SERVICES", margin, currentY, {
        fontSize: 14,
        bold: true
      });
      currentY += 8;
      
      // Table headers
      const colWidths = [30, 50, 50, 30]; // Date, ICD, CPT, Fee
      const colX = [margin, margin + 30, margin + 80, margin + 130];
      
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, currentY, contentWidth, 8, 'F');
      pdf.rect(margin, currentY, contentWidth, 8);
      
      // Vertical lines for table
      colX.slice(1).forEach((x) => {
        pdf.line(x, currentY, x, currentY + 8);
      });
      
      currentY += 6;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Date", colX[0] + 1, currentY);
      pdf.text("ICD-10 Codes", colX[1] + 1, currentY);
      pdf.text("CPT Codes", colX[2] + 1, currentY);
      pdf.text("Fee", colX[3] + 1, currentY);
      
      currentY += 4;
      
      // Table rows - check space for each row individually
      let totalFee = 0;
      superbill.visits.forEach((visit, index) => {
        // Always keep row + total row together (need space for at least 2 rows)
        const spaceNeeded = rowHeight * 2; // current row + total row
        if (checkPageBreak(spaceNeeded)) {
          // If we added a new page, redraw table header
          currentY = addText("SERVICES (continued)", margin, currentY, {
            fontSize: 14,
            bold: true
          });
          currentY += 8;
          
          // Redraw table header
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, currentY, contentWidth, 8, 'F');
          pdf.rect(margin, currentY, contentWidth, 8);
          
          colX.slice(1).forEach((x) => {
            pdf.line(x, currentY, x, currentY + 8);
          });
          
          currentY += 6;
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("Date", colX[0] + 1, currentY);
          pdf.text("ICD-10 Codes", colX[1] + 1, currentY);
          pdf.text("CPT Codes", colX[2] + 1, currentY);
          pdf.text("Fee", colX[3] + 1, currentY);
          
          currentY += 4;
        }
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        
        // Row background (alternating)
        if (index % 2 === 1) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, currentY - 2, contentWidth, 8, 'F');
        }
        
        // Row border
        pdf.rect(margin, currentY - 2, contentWidth, 8);
        
        // Vertical lines
        colX.slice(1).forEach((x) => {
          pdf.line(x, currentY - 2, x, currentY + 6);
        });
        
        // Cell content
        pdf.text(formatDate(visit.date), colX[0] + 1, currentY + 2);
        pdf.text(visit.icdCodes.join(", "), colX[1] + 1, currentY + 2);
        pdf.text(visit.cptCodes.join(", "), colX[2] + 1, currentY + 2);
        pdf.text(formatCurrency(visit.fee), colX[3] + 1, currentY + 2);
        
        totalFee += visit.fee || 0;
        currentY += 8;
      });
      
      // Total row
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, currentY, contentWidth, 8, 'F');
      pdf.rect(margin, currentY, contentWidth, 8);
      
      // Vertical lines for total row
      colX.slice(1).forEach((x) => {
        pdf.line(x, currentY, x, currentY + 8);
      });
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("Total:", colX[2] + 1, currentY + 5);
      pdf.text(formatCurrency(totalFee), colX[3] + 1, currentY + 5);
      
      currentY += 15;
      
      // NOTES SECTION
      const notesHeaderHeight = 15;
      checkPageBreak(notesHeaderHeight);
      
      currentY = addText("NOTES", margin, currentY, {
        fontSize: 14,
        bold: true
      });
      currentY += 8;
      
      // Notes content
      const hasNotes = superbill.visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0));
      
      if (hasNotes) {
        superbill.visits.forEach(visit => {
          const hasContent = visit.notes || (visit.mainComplaints && visit.mainComplaints.length > 0);
          if (hasContent) {
            checkPageBreak(15);
            
            currentY = addText(`${formatDate(visit.date)}:`, margin, currentY, {
              fontSize: 10,
              bold: true
            });
            currentY += 2;
            
            if (visit.mainComplaints && visit.mainComplaints.length > 0) {
              currentY = addText(`Main Complaints: ${visit.mainComplaints.join(', ')}`, margin + 5, currentY, {
                fontSize: 9
              });
              currentY += 3;
            }
            
            if (visit.notes) {
              currentY = addText(visit.notes, margin + 5, currentY, {
                fontSize: 9
              });
              currentY += 3;
            }
            
            currentY += 3;
          }
        });
      } else {
        currentY = addText("No notes", margin, currentY, {
          fontSize: 10
        });
      }
      
      // FOOTER
      checkPageBreak(20);
      currentY += 10;
      
      currentY = addText("This is a superbill for services rendered. It is not a bill.", margin, currentY, {
        fontSize: 9
      });
      currentY += 4;
      
      currentY = addText("Please submit to your insurance company for reimbursement.", margin, currentY, {
        fontSize: 9
      });
      
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
