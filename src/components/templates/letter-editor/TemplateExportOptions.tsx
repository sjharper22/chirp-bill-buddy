
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportFormat } from '@/types/template';

interface TemplateExportOptionsProps {
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  exportOptionsOpen: boolean;
  setExportOptionsOpen: (isOpen: boolean) => void;
  handleExport: () => void;
}

export function TemplateExportOptions({
  exportFormat,
  setExportFormat,
  exportOptionsOpen,
  setExportOptionsOpen,
  handleExport
}: TemplateExportOptionsProps) {
  return (
    <Dialog open={exportOptionsOpen} onOpenChange={setExportOptionsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Export Options</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="bundle">Bundle</TabsTrigger>
          </TabsList>
          <TabsContent value="format" className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Export Format</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'} 
                  onClick={() => setExportFormat('pdf')}
                  className="w-full"
                >
                  PDF
                </Button>
                <Button 
                  variant={exportFormat === 'docx' ? 'default' : 'outline'} 
                  onClick={() => setExportFormat('docx')}
                  className="w-full"
                >
                  DOCX
                </Button>
                <Button 
                  variant={exportFormat === 'html' ? 'default' : 'outline'} 
                  onClick={() => setExportFormat('html')}
                  className="w-full"
                >
                  HTML
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bundle" className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Bundle with</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-superbill" className="rounded" defaultChecked />
                  <label htmlFor="include-superbill">Superbill</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-coversheet" className="rounded" />
                  <label htmlFor="include-coversheet">Cover Sheet</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-invoice" className="rounded" />
                  <label htmlFor="include-invoice">Invoice</label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button onClick={handleExport}>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
