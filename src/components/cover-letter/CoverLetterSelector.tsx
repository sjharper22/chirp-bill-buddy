
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
}

export function CoverLetterSelector({ superbill, onTemplateSelected }: CoverLetterSelectorProps) {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [processedContent, setProcessedContent] = useState<string>("");
  
  // Query to fetch available letter templates
  const { data: templates, isLoading } = useQuery({
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
      
      // If no templates found, create a default template
      if (!data || data.length === 0) {
        const defaultTemplate = {
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
          category: 'cover_letter' as const,
          created_by: 'system',
          is_default: true
        };
        
        return [defaultTemplate] as LetterTemplate[];
      }
      
      return data as LetterTemplate[];
    },
  });

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
  
  // Select the first template by default when templates load
  useEffect(() => {
    if (templates?.length && !selectedTemplateId) {
      const defaultTemplate = templates.find(t => t.is_default) || templates[0];
      setSelectedTemplateId(defaultTemplate.id);
    }
  }, [templates, selectedTemplateId]);
  
  // If there are no templates, create a fallback content string
  useEffect(() => {
    if ((!templates || templates.length === 0) && !isLoading) {
      const context = createContextFromSuperbill(superbill);
      const fallbackContent = `${new Date().toLocaleDateString()}

To Whom It May Concern:

Please find enclosed a superbill for services rendered to ${superbill.patientName}. The total charge for these services is $${superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0).toFixed(2)}.

I would appreciate your prompt attention to this claim. If you have any questions or require additional information, please contact our office.

Thank you for your assistance.

Sincerely,

${superbill.providerName}
${superbill.clinicName}
${superbill.clinicPhone}
${superbill.clinicEmail}`;
      
      setProcessedContent(fallbackContent);
      
      if (onTemplateSelected) {
        onTemplateSelected({
          id: 'fallback',
          title: 'Default Cover Letter',
          content: { text: fallbackContent },
          category: 'cover_letter',
          created_by: 'system',
          is_default: true
        }, fallbackContent);
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
