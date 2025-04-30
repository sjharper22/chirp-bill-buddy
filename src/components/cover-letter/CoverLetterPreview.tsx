import { Card } from "@/components/ui/card";
import { Superbill } from "@/types/superbill";
import { LetterTemplate } from "@/types/template";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createContextFromSuperbill, processTemplate } from "@/lib/utils/template-utils";

interface CoverLetterPreviewProps {
  superbill: Superbill;
  selectedTemplateId?: string;
}

export function CoverLetterPreview({ superbill, selectedTemplateId }: CoverLetterPreviewProps) {
  const [processedContent, setProcessedContent] = useState<string>("");
  
  // Fetch letter templates
  const { data: templates } = useQuery({
    queryKey: ['letter_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*');

      if (error) throw error;
      
      // Create a custom template for the patient reimbursement guide
      const customTemplate: LetterTemplate = {
        id: 'custom-patient-reimbursement',
        title: 'Patient Reimbursement Guide',
        content: {
          text: `Collective Family Chiropractic  
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
The Collective Family Chiropractic Team`
        },
        category: 'cover_letter',
        created_by: 'system',
        is_default: true
      };
      
      // If no data or empty array, return the custom template
      if (!data || data.length === 0) {
        return [customTemplate] as LetterTemplate[];
      }
      
      // Add the custom template to the beginning of the array
      return [customTemplate, ...data] as LetterTemplate[];
    },
  });
  
  // Process template and set content
  useEffect(() => {
    if (!templates?.length) return;
    
    let selectedTemplate;
    
    // Try to find the specified template by ID
    if (selectedTemplateId) {
      selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    }
    
    // If no template was found or specified, prioritize the custom template, then default, then first
    if (!selectedTemplate) {
      selectedTemplate = templates.find(t => t.id === 'custom-patient-reimbursement') || 
                         templates.find(t => t.is_default && t.category === 'cover_letter') || 
                         templates[0];
    }
    
    if (selectedTemplate?.content?.text) {
      const context = createContextFromSuperbill(superbill);
      const processed = processTemplate(selectedTemplate.content.text, context);
      console.log("Processed template with context:", context);
      setProcessedContent(processed);
    } else {
      // Fallback content if no template is available
      setProcessedContent(generateFallbackContent(superbill));
    }
  }, [templates, superbill, selectedTemplateId]);
  
  // Helper function to generate fallback content
  const generateFallbackContent = (superbill: Superbill) => {
    const today = new Date().toLocaleDateString();
    const totalFee = superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0).toFixed(2);
    
    return `${today}

To Whom It May Concern:

Please find enclosed a superbill for services rendered to ${superbill.patientName}. The total charge for these services is $${totalFee}.

I would appreciate your prompt attention to this claim. If you have any questions or require additional information, please contact our office.

Thank you for your assistance.

Sincerely,

${superbill.providerName}
${superbill.clinicName}
${superbill.clinicPhone}
${superbill.clinicEmail}`;
  };
  
  if (!processedContent) {
    return (
      <Card className="p-6 mb-6 cover-letter-preview">
        <div className="whitespace-pre-wrap">
          {generateFallbackContent(superbill).split('\n').map((line, index) => (
            <div key={index} className={line.trim() === "" ? "h-4" : ""}>
              {line}
            </div>
          ))}
        </div>
      </Card>
    );
  }
  
  // Process formatting with clean visual output
  const processFormattedText = (text: string) => {
    // Convert section numbers to bold instead of using markdown
    let processed = text.replace(/^(\d+)\.\s+(.*?)$/gm, '<strong>$1. $2</strong>');
    
    // Handle horizontal rules (---)
    processed = processed.replace(/^---$/gm, '<hr className="my-4 border-t border-gray-300" />');
    
    // Handle bullet points while keeping them clean
    processed = processed.replace(/^- (.*?)$/gm, '<span className="flex"><span className="mr-2">•</span><span>$1</span></span>');
    
    return processed;
  };
  
  return (
    <Card className="p-6 mb-6 cover-letter-preview">
      <div className="whitespace-pre-wrap">
        {processedContent.split('\n').map((line, index) => {
          if (line.trim() === "") {
            return <div key={index} className="h-4"></div>;
          }
          
          const processedLine = processFormattedText(line);
          
          // Special handling for lines containing horizontal rules
          if (processedLine.includes('<hr')) {
            return <hr key={index} className="my-4 border-t border-gray-300" />;
          }
          
          return (
            <div 
              key={index}
              dangerouslySetInnerHTML={{ __html: processedLine }}
              className={line.startsWith('-') ? 'pl-4' : ''}
            />
          );
        })}
      </div>
    </Card>
  );
}
