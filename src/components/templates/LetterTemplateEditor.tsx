
import React from 'react';
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
import { Textarea } from "@/components/ui/textarea";

interface LetterTemplateEditorProps {
  patientData?: any;
  superbillData?: any;
  onSave?: () => void;
}

const DEFAULT_TEMPLATE = `Out-of-Network Insurance Reimbursement Guide & Cover Sheet
Supporting your wellness — every step of the way

We've prepared this document to help you submit your superbill to your insurance provider for possible out-of-network reimbursement. While we do not bill insurance directly, many of our patients receive partial or full reimbursement depending on their plan. If you have any questions or need a new copy, we're happy to help!

Patient & Superbill Summary
Patient Name: _____________________________

Date of Birth: _____________________________

Dates of Service: _____________________________

Total Number of Visits: _____________________________

Total Charges: $_____________________________

Note: This is not a bill. It is a superbill, a detailed receipt to support your claim for insurance reimbursement.

Step-by-Step Reimbursement Instructions
1. Confirm Your Insurance Benefits: Call your insurance provider or check your online portal. Ask if your plan covers out-of-network chiropractic care. Note your deductible, out-of-network benefits, and required claim forms.
2. Complete a Claim Form: Most insurance companies use a CMS-1500 or proprietary claim form. Download it from your provider's website or call to request a copy. Fill out the member and patient sections as instructed.
3. Attach Your Superbill: Ensure the superbill includes your name, DOB, dates of service, ICD-10 and CPT codes, payment amounts, and provider details.
4. Submit Your Claim: Follow your insurance provider's submission instructions (mail, fax, or upload). Keep a copy for your records.
5. Wait for Reimbursement: Processing may take 2–6 weeks. Monitor your Explanation of Benefits (EOB).
6. Follow Up if Needed: If you don't hear back, call your provider. Reference the dates of service and provider info on the superbill.

Clinic Information for Insurance Use
Provider: Dr. Ashley Harper, DC
Clinic: Collective Family Chiropractic
Address: 700 Churchill Court, Suite 130, Woodstock, GA 30188
Phone: (678) 540-8850
Email: info@collectivefamilychiro.com
EIN: 92-0772385
NPI #: 1053801449

Final Checklist Before You Submit
□ Claim form is complete
□ Superbill is attached
□ You have kept a copy for your records
□ You know how to follow up

Need Help?
If you misplace this form or have questions, we're here to support you. You can visit our help page, which has FAQs and more information.

Thank you for choosing Collective Family Chiropractic. We're honored to be a part of your wellness journey!`;

export function LetterTemplateEditor({ 
  patientData, 
  superbillData,
  onSave 
}: LetterTemplateEditorProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = React.useState("Out-of-Network Insurance Guide");
  const [category, setCategory] = React.useState<"cover_letter" | "appeal_letter" | "general">("cover_letter");
  const [content, setContent] = React.useState(DEFAULT_TEMPLATE);

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

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
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
            <SelectItem value="appeal_letter">Appeal Letter</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4">
        <Textarea
          className="w-full min-h-[400px] p-4 font-mono text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your template..."
        />
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
}
