import { useState, useEffect } from 'react';
import { ExtendedTemplateCategory } from '@/types/template';
import { DEFAULT_TEMPLATE } from './constants/defaultTemplate';
import { TEMPLATE_VARIABLES } from './constants/templateVariables';
import { useTemplateContentProcessor } from './hooks/useTemplateContentProcessor';
import { useTemplateSave } from './hooks/useTemplateSave';
import { useTemplateExport } from './hooks/useTemplateExport';

interface UseTemplateEditorProps {
  patientData?: any;
  superbillData?: any;
  onSave?: () => void;
}

export function useTemplateEditor({ patientData, superbillData, onSave }: UseTemplateEditorProps = {}) {
  const [title, setTitle] = useState("Out-of-Network Insurance Guide");
  const [category, setCategory] = useState<ExtendedTemplateCategory>("cover_letter");
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Use the refactored hooks
  const { previewContent, setPreviewContent, processContentForPreview } = useTemplateContentProcessor();
  const { exportFormat, setExportFormat, exportOptionsOpen, setExportOptionsOpen, handleExport } = useTemplateExport();
  const { handleSaveTemplate } = useTemplateSave({ title, category, content, onSave });

  // Initialize with a default template
  useEffect(() => {
    // Process the initial content for preview
    processContentForPreview(content);
  }, []);

  const handleContentChange = (newContent: string, htmlContent?: string) => {
    setContent(newContent);
    
    // If HTML content is provided, use it for preview
    if (htmlContent) {
      setPreviewContent(htmlContent);
    } else {
      // Otherwise process the raw content
      processContentForPreview(newContent);
    }
  };

  // Format variables for the editor
  const formattedVariables = TEMPLATE_VARIABLES.map(v => ({
    label: v.label,
    variable: v.variable
  }));

  return {
    title,
    setTitle,
    category,
    setCategory,
    content,
    setContent,
    isPreviewOpen,
    setIsPreviewOpen,
    previewContent,
    exportFormat,
    setExportFormat,
    exportOptionsOpen,
    setExportOptionsOpen,
    handleContentChange,
    handleSaveTemplate,
    handleExport,
    formattedVariables
  };
}
