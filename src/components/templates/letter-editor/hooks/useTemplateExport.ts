
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ExportFormat } from '@/types/template';

export function useTemplateExport() {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [exportOptionsOpen, setExportOptionsOpen] = useState(false);

  const handleExport = () => {
    // In a real implementation, this would trigger the actual export
    toast({
      title: "Export Started",
      description: `Exporting template as ${exportFormat.toUpperCase()}...`,
    });
    
    // Close the export options dialog
    setExportOptionsOpen(false);
  };

  return {
    exportFormat,
    setExportFormat,
    exportOptionsOpen,
    setExportOptionsOpen,
    handleExport
  };
}
