import { useState, useEffect } from "react";
import { Superbill } from "@/types/superbill";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/preview/Preview";
import { ActionButtons } from "@/components/preview/ActionButtons";
import { CoverLetterSelector } from "@/components/cover-letter/CoverLetterSelector";
import { LetterTemplate } from "@/types/template";
import { createContextFromSuperbill, processTemplate } from "@/lib/utils/template-utils";

interface SuperbillPreviewProps {
  superbill: Superbill;
}

export function SuperbillPreview({ superbill }: SuperbillPreviewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [processedContent, setProcessedContent] = useState<string>("");
  
  const handleTemplateSelected = (template: LetterTemplate, content: string) => {
    console.log("Template selected:", template.title);
    console.log("Processed content:", content);
    setSelectedTemplate(template);
    setProcessedContent(content);
  };

  // Generate a default custom cover letter if none is selected
  useEffect(() => {
    if (!processedContent && dialogOpen) {
      const context = createContextFromSuperbill(superbill);
      
      // The custom template content
      const customTemplate = `Collective Family Chiropractic  
700 Churchill Court, Suite 130  
Woodstock, GA 30188  
(678) 540-8850  
info@collectivefamilychiro.com  

{{dates.today}}

RE: Request for Reimbursement — Chiropractic Services for {{patient.name}}

Dear {{patient.salutation_name}},  

Enclosed with this letter, you will find a superbill summarizing the chiropractic care you received at our office, along with individual invoices for your records. These documents are provided to assist you in submitting a reimbursement claim to your insurance provider for out-of-network services.

Below is a simple set of steps to help guide you through the process:

---

1. Access Your Claim Form  
Log in to your insurance provider's member portal or contact them directly to obtain their standard out-of-network reimbursement form.

2. Fill Out the Required Fields  
Complete all necessary sections of the form, including your personal information and the dates of care.

3. Attach Supporting Documents  
Include the following with your submission:  
- The superbill we've provided  
- The attached invoices  
- Your completed claim form

4. Submit to Your Insurance Provider  
Most providers accept claims by mail, fax, or through a member portal. Be sure to keep a copy for your records.

5. Track Your Claim  
After processing, your provider will issue an Explanation of Benefits (EOB) and, if approved, send your reimbursement.

---

If your provider requests additional documentation, they're welcome to contact our clinic directly. We're happy to assist if needed.

Thank you again for choosing Collective Family Chiropractic. We're honored to be part of your wellness journey.

Warmly,  
The Collective Family Chiropractic Team`;
      
      // Process the custom template with the context
      const defaultContent = processTemplate(customTemplate, context);
      setProcessedContent(defaultContent);
      
      // Create a template object for this custom template
      const customTemplateObj: LetterTemplate = {
        id: 'custom-patient-reimbursement',
        title: 'Patient Reimbursement Guide',
        content: { text: customTemplate },
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
        
        <CoverLetterSelector 
          superbill={superbill}
          onTemplateSelected={handleTemplateSelected}
          defaultTemplate={selectedTemplate}
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
