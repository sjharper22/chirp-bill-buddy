
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Mail, Check, FileText } from "lucide-react";
import { Superbill } from "@/types/superbill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface BulkActionsProps {
  selectedSuperbills: Superbill[];
  showCoverSheet: boolean;
  setShowCoverSheet: (show: boolean) => void;
  showCoverLetter: boolean;
  setShowCoverLetter: (show: boolean) => void;
  handleDownloadAll: () => void;
  handlePreviewCoverLetter: () => void;
  generateCoverSheetHtml: (superbills: Superbill[]) => string;
}

export function BulkActions({
  selectedSuperbills,
  showCoverSheet,
  setShowCoverSheet,
  showCoverLetter,
  setShowCoverLetter,
  handleDownloadAll,
  handlePreviewCoverLetter,
  generateCoverSheetHtml
}: BulkActionsProps) {
  const [activeTab, setActiveTab] = useState<string>("options");

  return (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Bulk Actions</h3>
          <p className="text-sm text-muted-foreground">
            Apply actions to selected patients
          </p>
        </div>
        
        <Tabs defaultValue="options" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="space-y-2 mt-2">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <Checkbox 
                  id="cover-sheet" 
                  checked={showCoverSheet}
                  onCheckedChange={() => setShowCoverSheet(!showCoverSheet)}
                />
                <label 
                  htmlFor="cover-sheet" 
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include cover sheet
                </label>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="cover-letter" 
                  checked={showCoverLetter}
                  onCheckedChange={() => setShowCoverLetter(!showCoverLetter)}
                />
                <label 
                  htmlFor="cover-letter" 
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include cover letter
                </label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-2 mt-2">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadAll}
                disabled={selectedSuperbills.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Download All PDFs
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={selectedSuperbills.length === 0}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email to Patients
              </Button>
              
              {showCoverLetter && selectedSuperbills.length > 0 && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewCoverLetter}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Preview Cover Letter
                </Button>
              )}
              
              {showCoverSheet && selectedSuperbills.length > 0 && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (!printWindow) {
                      alert('Please allow pop-ups to print the cover sheet.');
                      return;
                    }
                    
                    const coverSheetHtml = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Submission Cover Sheet</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                          </style>
                        </head>
                        <body>
                          ${generateCoverSheetHtml(selectedSuperbills)}
                        </body>
                      </html>
                    `;
                    
                    printWindow.document.open();
                    printWindow.document.write(coverSheetHtml);
                    printWindow.document.close();
                    
                    setTimeout(() => {
                      printWindow.print();
                    }, 500);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Print Cover Sheet Only
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
