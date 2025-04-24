
import React from 'react';
import { FileText, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "./TemplateCard";

interface Template {
  id: string;
  title: string;
  content: any;
  category: string;
  is_default?: boolean;
}

interface TemplatesGridProps {
  templates: Template[];
  isLoading: boolean;
  templateType: string;
  onCreateNew: () => void;
  onEditTemplate: (template: Template) => void;
}

export function TemplatesGrid({
  templates,
  isLoading,
  templateType,
  onCreateNew,
  onEditTemplate,
}: TemplatesGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-lg font-medium mt-4 mb-2">No {templateType} yet</p>
        <p className="text-muted-foreground mb-6">
          Create your first {templateType.toLowerCase()}
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create {templateType}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          title={template.title}
          type={templateType}
          content={template.content?.text || template.content}
          isDefault={template.is_default}
          onEdit={() => onEditTemplate(template)}
          onUse={() => onEditTemplate(template)}
        />
      ))}
    </div>
  );
}
