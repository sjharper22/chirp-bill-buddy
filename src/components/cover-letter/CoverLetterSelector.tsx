
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
                // For now, just show a toast
                toast({
                  title: "No templates",
                  description: "Please create a template first",
                });
              }}
            >
              Create Template
            </Button>
          )}
        </div>
      </div>
      
      {selectedTemplate && (
        <Card className="p-4">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n/g, '<br />') }} />
          </div>
        </Card>
      )}
    </div>
  );
}
