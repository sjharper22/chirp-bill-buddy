import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { RichTextEditor } from './editor/RichTextEditor';
import { TemplateCategory, TemplateVariable } from '@/types/template';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LetterTemplateEditorProps {
  patientData?: any;
  superbillData?: any;
  onSave?: () => void;
}

// Template variables that can be inserted
const TEMPLATE_VARIABLES: TemplateVariable[] = [
  { label: 'Patient Name', variable: 'patient.name', group: 'Patient' },
  { label: 'Patient First Name', variable: 'patient.firstName', group: 'Patient' },
  { label: 'Date of Birth', variable: 'patient.dob', group: 'Patient' },
  { label: 'Visit Period', variable: 'superbill.visitDateRange', group: 'Visits' },
  { label: 'Total Visits', variable: 'superbill.totalVisits', group: 'Visits' },
  { label: 'Total Charges', variable: 'superbill.totalFee', group: 'Billing' },
  { label: 'Clinic Name', variable: 'clinic.name', group: 'Clinic' },
  { label: 'Provider Name', variable: 'clinic.provider', group: 'Clinic' },
  { label: 'NPI Number', variable: 'clinic.npi', group: 'Clinic' },
  { label: 'EIN Number', variable: 'clinic.ein', group: 'Clinic' },
  { label: 'Clinic Address', variable: 'clinic.address', group: 'Clinic' },
  { label: 'Clinic Phone', variable: 'clinic.phone', group: 'Clinic' },
  { label: 'Today\'s Date', variable: 'dates.today', group: 'Dates' },
];

const DEFAULT_TEMPLATE = `Out-of-Network Insurance Reimbursement Guide & Cover Sheet
Supporting your wellness — every step of the way

We've prepared this document to help you submit your superbill to your insurance provider for possible out-of-network reimbursement. While we do not bill insurance directly, many of our patients receive partial or full reimbursement depending on their plan. If you have any questions or need a new copy, we're happy to help!

Patient & Superbill Summary
Patient Name: {{patient.name}}

Date of Birth: {{patient.dob}}

Dates of Service: {{superbill.visitDateRange}}

Total Number of Visits: {{superbill.totalVisits}}

Total Charges: {{superbill.totalFee}}

Note: This is not a bill. It is a superbill, a detailed receipt to support your claim for insurance reimbursement.

Step-by-Step Reimbursement Instructions
1. Confirm Your Insurance Benefits: Call your insurance provider or check your online portal. Ask if your plan covers out-of-network chiropractic care. Note your deductible, out-of-network benefits, and required claim forms.
2. Complete a Claim Form: Most insurance companies use a CMS-1500 or proprietary claim form. Download it from your provider's website or call to request a copy. Fill out the member and patient sections as instructed.
3. Attach Your Superbill: Ensure the superbill includes your name, DOB, dates of service, ICD-10 and CPT codes, payment amounts, and provider details.
4. Submit Your Claim: Follow your insurance provider's submission instructions (mail, fax, or upload). Keep a copy for your records.
5. Wait for Reimbursement: Processing may take 2–6 weeks. Monitor your Explanation of Benefits (EOB).
6. Follow Up if Needed: If you don't hear back, call your provider. Reference the dates of service and provider info on the superbill.

Clinic Information for Insurance Use
Provider: {{clinic.provider}}
Clinic: {{clinic.name}}
Address: {{clinic.address}}
Phone: {{clinic.phone}}
Email: {{clinic.email}}
EIN: {{clinic.ein}}
NPI #: {{clinic.npi}}

Final Checklist Before You Submit
□ Claim form is complete
□ Superbill is attached
□ You have kept a copy for your records
□ You know how to follow up

Need Help?
If you misplace this form or have questions, we're here to support you. You can visit our help page, which has FAQs and more information.

Thank you for choosing our clinic. We're honored to be a part of your wellness journey!`;

export function LetterTemplateEditor({ 
  patientData, 
  superbillData,
  onSave 
}: LetterTemplateEditorProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("Out-of-Network Insurance Guide");
  const [category, setCategory] = useState<TemplateCategory>("cover_letter");
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'html'>('pdf');
  const [exportOptionsOpen, setExportOptionsOpen] = useState(false);

  // Initialize with a default template
  useEffect(() => {
    // We're keeping the initial content as text for backward compatibility
    setPreviewContent(content);
  }, []);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // For preview, we'll use the raw content for now
    // In a real implementation, you'd want to parse the Lexical JSON and render it as HTML
    setPreviewContent(newContent);
  };

  const handleSaveTemplate = async () => {
    try {
      if (!user) {
        throw new Error("You must be logged in to save templates");
      }

      const { error } = await supabase
        .from('letter_templates')
        .insert({
          title,
          content: { text: content },
          category,
          created_by: user.id,
          is_default: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      if (onSave) onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // In a real implementation, this would trigger the actual export
    toast({
      title: "Export Started",
      description: `Exporting template as ${exportFormat.toUpperCase()}...`,
    });
    
    // Close the export options dialog
    setExportOptionsOpen(false);
  };

  // Format variables for the editor
  const formattedVariables = TEMPLATE_VARIABLES.map(v => ({
    label: v.label,
    variable: v.variable
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Template Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover_letter">Cover Letter</SelectItem>
            <SelectItem value="reimbursement_instructions">Reimbursement Instructions</SelectItem>
            <SelectItem value="referral_letter">Referral Letter</SelectItem>
            <SelectItem value="thank_you_note">Thank You Note</SelectItem>
            <SelectItem value="reminder_message">Reminder Message</SelectItem>
            <SelectItem value="appeal_letter">Appeal Letter</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
        
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Preview</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Template Preview</DialogTitle>
            </DialogHeader>
            <div className="p-4 border rounded-md bg-white">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewContent }} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <RichTextEditor 
        content={content}
        onChange={handleContentChange}
        placeholders={formattedVariables}
      />

      <div className="flex justify-between items-center">
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

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveTemplate}>Save Template</Button>
        </div>
      </div>
    </div>
  );
}
