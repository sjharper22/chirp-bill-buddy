
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { LetterTemplate } from "@/types/template";
import { processTemplate, createContextFromSuperbill } from "@/lib/utils/template-utils";

export const useLetterTemplates = (
  superbill: Superbill,
  onTemplateSelected?: (template: LetterTemplate, processedContent: string) => void,
  defaultTemplate?: LetterTemplate | null
) => {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(defaultTemplate?.id || null);
  const [processedContent, setProcessedContent] = useState<string>("");
  const [customTemplates, setCustomTemplates] = useState<LetterTemplate[]>([]);
  
  // Add the default custom template if provided
  useEffect(() => {
    if (defaultTemplate && !customTemplates.some(t => t.id === defaultTemplate.id)) {
      setCustomTemplates(prev => [defaultTemplate, ...prev]);
    }
  }, [defaultTemplate, customTemplates]);
  
  // Query to fetch available letter templates
  const { data: fetchedTemplates, isLoading } = useQuery({
    queryKey: ['letter_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch letter templates",
          variant: "destructive"
        });
        throw error;
      }
      
      return data as LetterTemplate[];
    },
  });
  
  // Combine fetched templates with custom templates
  const templates = (() => {
    if (!fetchedTemplates) return customTemplates;
    
    // Filter out duplicates based on ID
    const combinedTemplates = [...customTemplates];
    
    fetchedTemplates.forEach(template => {
      if (!combinedTemplates.some(t => t.id === template.id)) {
        combinedTemplates.push(template);
      }
    });
    
    return combinedTemplates;
  })();

  // Find the selected template
  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);
  
  // Process the template content with the superbill data
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.content?.text) {
      const context = createContextFromSuperbill(superbill);
      const processed = processTemplate(selectedTemplate.content.text, context);
      setProcessedContent(processed);
      
      if (onTemplateSelected) {
        onTemplateSelected(selectedTemplate, processed);
      }
    }
  }, [selectedTemplate, superbill, onTemplateSelected]);
  
  // Select the default template or first template when templates load
  useEffect(() => {
    if (templates?.length && !selectedTemplateId) {
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate.id);
      } else {
        const template = templates.find(t => t.is_default) || templates[0];
        setSelectedTemplateId(template.id);
      }
    }
  }, [templates, selectedTemplateId, defaultTemplate]);
  
  // Create the patient reimbursement guide template if not already in the list
  useEffect(() => {
    if ((!templates || templates.length === 0) && !isLoading) {
      createAndProcessCustomTemplate();
    }
  }, [templates, isLoading, superbill, onTemplateSelected]);

  // Function to create and process the custom template
  const createAndProcessCustomTemplate = () => {
    const customTemplateText = `Collective Family Chiropractic  
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
      
    const context = createContextFromSuperbill(superbill);
    const processed = processTemplate(customTemplateText, context);
    
    const customTemplate: LetterTemplate = {
      id: 'custom-patient-reimbursement',
      title: 'Patient Reimbursement Guide',
      content: { text: customTemplateText },
      category: 'cover_letter',
      created_by: 'system',
      is_default: true
    };
    
    setCustomTemplates([customTemplate]);
    setSelectedTemplateId(customTemplate.id);
    setProcessedContent(processed);
    
    if (onTemplateSelected) {
      onTemplateSelected(customTemplate, processed);
    }
  };
  
  return {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    selectedTemplate,
    processedContent,
    isLoading,
    createAndProcessCustomTemplate
  };
};
