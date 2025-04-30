
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
      
      // If no templates found, return a default template
      if (!data || data.length === 0) {
        return [{
          id: 'default-cover-letter',
          title: 'Default Cover Letter',
          content: {
            text: `{{dates.today}}

To Whom It May Concern:

Please find enclosed a superbill for services rendered to {{patient.name}} between {{superbill.earliestDate}} and {{superbill.latestDate}}. The total charge for these services is {{superbill.totalFee}}.

I would appreciate your prompt attention to this claim. If you have any questions or require additional information, please contact our office.

Thank you for your assistance.

Sincerely,

{{clinic.provider}}
{{clinic.name}}
{{clinic.phone}}
{{clinic.email}}`
          },
          category: 'cover_letter',
          created_by: 'system',
          is_default: true
        }] as LetterTemplate[];
      }
      
      return data as LetterTemplate[];
    },
  });
  
  // Process template and set content
  useEffect(() => {
    if (!templates?.length) return;
    
    let selectedTemplate;
    
    if (selectedTemplateId) {
      selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    }
    
    // If no template is selected or found, use the default one
    if (!selectedTemplate) {
      selectedTemplate = templates.find(t => t.is_default && t.category === 'cover_letter') || 
                         templates.find(t => t.category === 'cover_letter') ||
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
  
  return (
    <Card className="p-6 mb-6 cover-letter-preview">
      <div className="whitespace-pre-wrap">
        {processedContent.split('\n').map((line, index) => (
          <div key={index} className={line.trim() === "" ? "h-4" : ""}>
            {line}
          </div>
        ))}
      </div>
    </Card>
  );
}
