
import React from 'react';
import { RichTextEditor } from './letter-editor/RichTextEditor';
import { TemplateHeader } from './letter-editor/TemplateHeader';
import { TemplateFooter } from './letter-editor/TemplateFooter';
import { useTemplateEditor } from './letter-editor/useTemplateEditor';

interface LetterTemplateEditorProps {
  patientData?: any;
  superbillData?: any;
  onSave?: () => void;
}

export function LetterTemplateEditor({ 
  patientData, 
  superbillData,
  onSave 
}: LetterTemplateEditorProps) {
  const {
    title,
    setTitle,
    category,
    setCategory,
    content,
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
  } = useTemplateEditor({
    patientData,
    superbillData,
    onSave
  });

  return (
    <div className="space-y-4">
      <TemplateHeader
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        previewContent={previewContent}
      />

      <RichTextEditor 
        content={content}
        onChange={handleContentChange}
        placeholders={formattedVariables}
      />

      <TemplateFooter
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        exportOptionsOpen={exportOptionsOpen}
        setExportOptionsOpen={setExportOptionsOpen}
        handleExport={handleExport}
        handleSaveTemplate={handleSaveTemplate}
      />
    </div>
  );
}
