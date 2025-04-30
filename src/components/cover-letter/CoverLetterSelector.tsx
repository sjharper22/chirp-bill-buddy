
import React from 'react';
import { Superbill } from "@/types/superbill";
import { LetterTemplate } from "@/types/template";
import { useLetterTemplates } from "@/hooks/useLetterTemplates";
import { TemplateSelector } from "./TemplateSelector";
import { TemplateContentPreview } from "./TemplateContentPreview";

interface CoverLetterSelectorProps {
  superbill: Superbill;
  onTemplateSelected?: (template: LetterTemplate, processedContent: string) => void;
  defaultTemplate?: LetterTemplate | null;
}

export function CoverLetterSelector({ 
  superbill, 
  onTemplateSelected, 
  defaultTemplate 
}: CoverLetterSelectorProps) {
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    processedContent,
    isLoading
  } = useLetterTemplates(superbill, onTemplateSelected, defaultTemplate);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Cover Letter</h3>
        
        <div className="flex items-center gap-2">
          <TemplateSelector
            isLoading={isLoading}
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={(value) => setSelectedTemplateId(value)}
          />
        </div>
      </div>
      
      {processedContent && (
        <TemplateContentPreview processedContent={processedContent} />
      )}
    </div>
  );
}
