import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Superbill } from "@/types/superbill";
import { LetterTemplate } from "@/types/template";
import { processTemplate, createContextFromSuperbill } from "@/lib/utils/template-utils";

interface CoverLetterSelectorProps {
  superbill: Superbill;
  onTemplateSelected?: (template: LetterTemplate, processedContent: string) => void;
  defaultTemplate?: LetterTemplate | null;
}

export function CoverLetterSelector({ superbill, onTemplateSelected, defaultTemplate }: CoverLetterSelectorProps) {
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
  const templates = React.useMemo(() => {
    if (!fetchedTemplates) return customTemplates;
    
    // Filter out duplicates based on ID
    const combinedTemplates = [...customTemplates];
    
    fetchedTemplates.forEach(template => {
      if (!combinedTemplates.some(t => t.id === template.id)) {
        combinedTemplates.push(template);
      }
    });
    
    return combinedTemplates;
  }, [fetchedTemplates, customTemplates]);

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
      // Create and process the custom template
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
    }
  }, [templates, isLoading, superbill, onTemplateSelected]);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Cover Letter</h3>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading templates...</span>
            </div>
          ) : templates?.length ? (
            <Select 
              value={selectedTemplateId || ''} 
              onValueChange={(value) => setSelectedTemplateId(value)}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Navigate to templates page would be implemented here
                toast({
                  title: "Using default template",
                  description: "No custom templates available.",
                });
              }}
            >
              Create Template
            </Button>
          )}
        </div>
      </div>
      
      {processedContent && (
        <Card className="p-4">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n/g, '<br />') }} />
          </div>
        </Card>
      )}
    </div>
  );
}
