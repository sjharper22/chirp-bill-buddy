
import { useState, useEffect } from "react";
import { Superbill } from "@/types/superbill";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/preview/Preview";
import { ActionButtons } from "@/components/preview/ActionButtons";
import { CoverLetterSelector } from "@/components/cover-letter/CoverLetterSelector";
import { LetterTemplate } from "@/types/template";

interface SuperbillPreviewProps {
  superbill: Superbill;
}

export function SuperbillPreview({ superbill }: SuperbillPreviewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [processedContent, setProcessedContent] = useState<string>("");
  
  const handleTemplateSelected = (template: LetterTemplate, content: string) => {
    setSelectedTemplate(template);
    setProcessedContent(content);
  };

  // Generate a default cover letter if none is selected
  useEffect(() => {
    if (!processedContent && dialogOpen) {
      const defaultContent = `${new Date().toLocaleDateString()}

To Whom It May Concern:

Please find enclosed a superbill for services rendered to ${superbill.patientName}. 
The total charge for these services is $${superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0).toFixed(2)}.

Thank you for your assistance.

Sincerely,
${superbill.providerName}
${superbill.clinicName}
${superbill.clinicPhone}`;

      setProcessedContent(defaultContent);
    }
  }, [dialogOpen, processedContent, superbill]);
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Preview Superbill
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Superbill Preview</DialogTitle>
          <DialogDescription>
            Preview and download superbill with optional cover letter
          </DialogDescription>
        </DialogHeader>
        
        <CoverLetterSelector 
          superbill={superbill}
          onTemplateSelected={handleTemplateSelected}
        />
        
        <Preview 
          superbill={superbill} 
          selectedTemplateId={selectedTemplate?.id}
          showCoverLetter={true}
        />
        
        <ActionButtons 
          superbill={superbill} 
          coverLetterContent={processedContent}
        />
      </DialogContent>
    </Dialog>
  );
}
