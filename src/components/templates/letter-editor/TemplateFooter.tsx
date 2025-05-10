
import React from 'react';
import { Button } from "@/components/ui/button";
import { TemplateExportOptions } from './TemplateExportOptions';
import { ExportFormat } from '@/types/template';

interface TemplateFooterProps {
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  exportOptionsOpen: boolean;
  setExportOptionsOpen: (isOpen: boolean) => void;
  handleExport: () => void;
  handleSaveTemplate: () => void;
}

export function TemplateFooter({
  exportFormat,
  setExportFormat,
  exportOptionsOpen,
  setExportOptionsOpen,
  handleExport,
  handleSaveTemplate
}: TemplateFooterProps) {
  return (
    <div className="flex justify-between items-center">
      <TemplateExportOptions
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        exportOptionsOpen={exportOptionsOpen}
        setExportOptionsOpen={setExportOptionsOpen}
        handleExport={handleExport}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
}
