import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { ExportFormat, ExtendedTemplateCategory, TemplateCategory, TemplateVariable } from '@/types/template';

// Default template text
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

// Template variables that can be inserted
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
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

interface UseTemplateEditorProps {
  patientData?: any;
  superbillData?: any;
  onSave?: () => void;
}

export function useTemplateEditor({ patientData, superbillData, onSave }: UseTemplateEditorProps = {}) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("Out-of-Network Insurance Guide");
  const [category, setCategory] = useState<ExtendedTemplateCategory>("cover_letter");
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [exportOptionsOpen, setExportOptionsOpen] = useState(false);

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
  
  // Process content for preview - converts JSON if needed or uses HTML
  const processContentForPreview = (rawContent: string) => {
    try {
      // Check if content is JSON (Lexical format)
      const parsedContent = JSON.parse(rawContent);
      
      // If it's JSON, convert it to a readable format
      if (parsedContent && typeof parsedContent === 'object') {
        // Create a simple HTML representation of the content
        let previewHtml = '';
        
        try {
          // Try to extract text content from the Lexical JSON structure
          if (parsedContent.root && parsedContent.root.children) {
            parsedContent.root.children.forEach((node: any) => {
              if (node.type === 'paragraph') {
                let text = '';
                if (node.children) {
                  node.children.forEach((child: any) => {
                    if (child.type === 'text') {
                      text += child.text;
                    }
                  });
                }
                previewHtml += `<p>${text}</p>`;
              } else if (node.type === 'heading') {
                const headingLevel = node.tag || 'h2';
                let text = '';
                if (node.children) {
                  node.children.forEach((child: any) => {
                    if (child.type === 'text') {
                      text += child.text;
                    }
                  });
                }
                previewHtml += `<${headingLevel}>${text}</${headingLevel}>`;
              }
            });
          }
        } catch (parseError) {
          // Fallback for simple display
          previewHtml = `<p>${rawContent.substring(0, 100)}...</p>`;
        }
        
        setPreviewContent(previewHtml);
      } else {
        // If not valid JSON, use as plain text
        setPreviewContent(`<p>${rawContent}</p>`);
      }
    } catch (e) {
      // Not JSON, treat as plain text
      // Replace variables with styled spans
      const formattedContent = rawContent.replace(/\{\{([^}]+)\}\}/g, 
        (match) => `<span class="bg-blue-100 px-1 rounded">${match}</span>`);
      
      // Convert newlines to paragraph breaks
      const htmlContent = formattedContent
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');
      
      setPreviewContent(htmlContent);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (!user) {
        throw new Error("You must be logged in to save templates");
      }

      // Convert the extended category to a database-compatible category if needed
      let dbCategory: TemplateCategory = "general";
      if (category === "cover_letter" || category === "appeal_letter" || category === "general") {
        dbCategory = category;
      }

      const { error } = await supabase
        .from('letter_templates')
        .insert({
          title,
          content: { text: content },
          category: dbCategory,
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
