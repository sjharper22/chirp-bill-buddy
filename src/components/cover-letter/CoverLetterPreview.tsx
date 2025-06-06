
import { Card } from "@/components/ui/card";
import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { Superbill } from "@/types/superbill";
import { useState, useEffect } from "react";
import { generateCoverLetterFromSuperbills } from "@/lib/utils/cover-letter";

interface CoverLetterPreviewProps {
  superbills: Superbill[];
  includeInvoiceNote?: boolean;
  editable?: boolean;
  superbill?: Superbill; // Added to support single superbill use case
  selectedTemplateId?: string;
  content?: string; // Allow direct content to be provided
  onContentChange?: (content: string) => void; // Allow content updates
}

export function CoverLetterPreview({ 
  superbills = [], // Default to empty array
  superbill, // Single superbill support
  includeInvoiceNote = true,
  editable = false,
  selectedTemplateId,
  content,
  onContentChange
}: CoverLetterPreviewProps) {
  const [displayContent, setDisplayContent] = useState<string>("");
  
  useEffect(() => {
    // If direct content is provided, use it
    if (content) {
      console.log("Using provided content for cover letter");
      setDisplayContent(content);
      return;
    }
    
    // Otherwise, generate content from superbills
    const billsToProcess = superbill ? [superbill] : superbills;
    
    if (billsToProcess.length > 0) {
      console.log("Generating cover letter from superbills:", billsToProcess.length);
      console.log("Patients:", billsToProcess.map(b => b.patientName).join(', '));
      const letterContent = generateCoverLetterFromSuperbills(billsToProcess, includeInvoiceNote);
      setDisplayContent(letterContent);
    }
  }, [superbills, superbill, includeInvoiceNote, selectedTemplateId, content]);
  
  // Handle AI enhancement
  const handleAIEnhancement = (enhancedContent: string) => {
    setDisplayContent(enhancedContent);
    if (onContentChange) {
      onContentChange(enhancedContent);
    }
  };

  // Don't render if we have no content to display
  if (!displayContent && superbills.length === 0 && !superbill) {
    return null;
  }

  const billsToProcess = superbill ? [superbill] : superbills;
  const patientInfo = billsToProcess.length > 0 ? {
    patients: billsToProcess.map(b => b.patientName),
    totalVisits: billsToProcess.reduce((sum, b) => sum + b.visits.length, 0),
    clinicName: billsToProcess[0]?.clinicName
  } : undefined;

  return (
    <div className="space-y-4">
      {editable && displayContent && (
        <div className="flex justify-end">
          <AIAssistantButton
            type="cover_letter_enhancement"
            prompt={`Enhance this insurance cover letter to be more professional and persuasive while maintaining accuracy: ${displayContent}`}
            context={patientInfo}
            onResult={handleAIEnhancement}
            variant="outline"
            size="sm"
          >
            Enhance with AI
          </AIAssistantButton>
        </div>
      )}
      
      <Card className="p-6 border rounded-md shadow-sm mb-8 no-page-break" data-testid="cover-letter-preview">
        <div dangerouslySetInnerHTML={{ __html: displayContent }} />
      </Card>
    </div>
  );
}
