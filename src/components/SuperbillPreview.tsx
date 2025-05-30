
import { useState, useEffect } from "react";
import { Superbill } from "@/types/superbill";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/preview/Preview";
import { ActionButtons } from "@/components/preview/ActionButtons";
import { CoverLetterSelector } from "@/components/cover-letter/CoverLetterSelector";
import { LetterTemplate } from "@/types/template";
import { generatePatientReimbursementGuide } from "@/lib/utils/reimbursement-guide-template";

interface SuperbillPreviewProps {
  superbill: Superbill;
}

export function SuperbillPreview({ superbill }: SuperbillPreviewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [processedContent, setProcessedContent] = useState<string>("");
  
  const handleTemplateSelected = (template: LetterTemplate, content: string) => {
    console.log("Template selected:", template.title);
    console.log("Processed content length:", content.length);
    setSelectedTemplate(template);
    setProcessedContent(content);
  };

  // Generate a default custom cover letter if none is selected
  useEffect(() => {
    if ((!processedContent || processedContent.trim() === "") && dialogOpen) {
      console.log("Generating default reimbursement guide");
      
      // Use the improved reimbursement guide generator
      const defaultContent = generatePatientReimbursementGuide(superbill);
      setProcessedContent(defaultContent);
      
      // Create a template object for this custom template
      const customTemplateObj: LetterTemplate = {
        id: 'custom-patient-reimbursement',
        title: 'Patient Reimbursement Guide',
        content: { 
          text: generatePatientReimbursementGuide(superbill)
        },
        category: 'cover_letter',
        created_by: 'system',
        is_default: true
      };
      
      setSelectedTemplate(customTemplateObj);
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
        
        {/* Action buttons at the very top */}
        <div className="flex justify-end px-1 pb-4">
          <ActionButtons superbill={superbill} coverLetterContent={processedContent} />
        </div>
        
        <CoverLetterSelector 
          superbill={superbill}
          onTemplateSelected={handleTemplateSelected}
          defaultTemplate={selectedTemplate}
        />
        
        <Preview 
          superbill={superbill} 
          selectedTemplateId={selectedTemplate?.id}
          showCoverLetter={true}
          coverLetterContent={processedContent}
        />
      </DialogContent>
    </Dialog>
  );
}
