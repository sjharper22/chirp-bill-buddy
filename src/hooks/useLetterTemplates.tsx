
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Superbill } from "@/types/superbill";
import { LetterTemplate } from "@/types/template";
import { processTemplate, createContextFromSuperbill } from "@/lib/utils/template-utils";
import { generatePatientReimbursementGuide } from "@/lib/utils/reimbursement-guide-template";

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
    if (selectedTemplate) {
      if (selectedTemplate.id === 'custom-patient-reimbursement') {
        // Use the direct generator for the special reimbursement guide
        const processed = generatePatientReimbursementGuide(superbill);
        setProcessedContent(processed);
        
        if (onTemplateSelected) {
          onTemplateSelected(selectedTemplate, processed);
        }
      } else if (selectedTemplate.content?.text) {
        // Process normal templates with variable substitution
        const context = createContextFromSuperbill(superbill);
        const processed = processTemplate(selectedTemplate.content.text, context);
        setProcessedContent(processed);
        
        if (onTemplateSelected) {
          onTemplateSelected(selectedTemplate, processed);
        }
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
    // Create a proper HTML template with formatting for the reimbursement guide
    const customTemplateObj: LetterTemplate = {
      id: 'custom-patient-reimbursement',
      title: 'Patient Reimbursement Guide',
      content: { 
        text: "This is a template for the patient reimbursement guide - the actual content is dynamically generated."
      },
      category: 'cover_letter',
      created_by: 'system',
      is_default: true
    };
    
    setCustomTemplates([customTemplateObj]);
    setSelectedTemplateId(customTemplateObj.id);
    
    // Generate the actual content
    const generated = generatePatientReimbursementGuide(superbill);
    setProcessedContent(generated);
    
    if (onTemplateSelected) {
      onTemplateSelected(customTemplateObj, generated);
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
