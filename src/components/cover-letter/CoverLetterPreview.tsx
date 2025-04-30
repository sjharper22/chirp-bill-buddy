
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
      return data as LetterTemplate[];
    },
  });
  
  // Find the selected template or use default
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
      setProcessedContent(processed);
    }
  }, [templates, superbill, selectedTemplateId]);
  
  if (!processedContent) {
    return null;
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
