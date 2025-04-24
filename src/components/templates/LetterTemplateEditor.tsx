
import React, { useEffect } from 'react';
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
import { PatientProfile } from "@/types/patient";
import { Superbill } from "@/types/superbill";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { useQuery } from "@tanstack/react-query";

interface LetterTemplateEditorProps {
  patientData?: PatientProfile;
  superbillData?: Superbill;
  onSave?: () => void;
}

const DEFAULT_TEMPLATE = `Out-of-Network Insurance Reimbursement Guide & Cover Sheet
Supporting your wellness — every step of the way

We've prepared this document to help you submit your superbill to your insurance provider for possible out-of-network reimbursement. While we do not bill insurance directly, many of our patients receive partial or full reimbursement depending on their plan. If you have any questions or need a new copy, we're happy to help!

Patient & Superbill Summary
Patient Name: {{patientName}}

Date of Birth: {{patientDOB}}

Dates of Service: {{serviceStartDate}} to {{serviceEndDate}}

Total Number of Visits: {{visitCount}}

Total Charges: ${{totalCharges}}

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
  const { patients } = usePatient();
  const { superbills } = useSuperbill();
  const [title, setTitle] = React.useState("Out-of-Network Insurance Guide");
  const [category, setCategory] = React.useState<"cover_letter" | "appeal_letter" | "general">("cover_letter");
  const [content, setContent] = React.useState(DEFAULT_TEMPLATE);
  const [selectedPatientId, setSelectedPatientId] = React.useState<string>("");
  const [selectedSuperbillId, setSelectedSuperbillId] = React.useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");

  // Fetch existing templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // If patientData or superbillData are passed in, set the selected IDs
  useEffect(() => {
    if (patientData) {
      setSelectedPatientId(patientData.id);
    }
    if (superbillData) {
      setSelectedSuperbillId(superbillData.id);
    }
  }, [patientData, superbillData]);

  // When template is selected, update content and title
  useEffect(() => {
    if (selectedTemplateId && templates) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setTitle(template.title);
        setContent(template.content.text);
        setCategory(template.category);
      }
    }
  }, [selectedTemplateId, templates]);

  // When patient and superbill are selected, populate template variables
  useEffect(() => {
    if (selectedPatientId || selectedSuperbillId) {
      let updatedContent = content;
      
      // Replace patient variables
      if (selectedPatientId) {
        const patient = patients.find(p => p.id === selectedPatientId);
        if (patient) {
          updatedContent = updatedContent.replace(/{{patientName}}/g, patient.name);
          updatedContent = updatedContent.replace(/{{patientDOB}}/g, patient.dob.toLocaleDateString());
        }
      }
      
      // Replace superbill variables
      if (selectedSuperbillId) {
        const superbill = superbills.find(sb => sb.id === selectedSuperbillId);
        if (superbill) {
          const visitCount = superbill.visits.length;
          const totalCharges = superbill.visits.reduce((total, visit) => total + visit.fee, 0);
          
          // Get earliest and latest visit dates
          const visitDates = superbill.visits.map(v => new Date(v.date).getTime());
          const startDate = new Date(Math.min(...visitDates));
          const endDate = new Date(Math.max(...visitDates));
          
          updatedContent = updatedContent.replace(/{{visitCount}}/g, visitCount.toString());
          updatedContent = updatedContent.replace(/{{totalCharges}}/g, totalCharges.toFixed(2));
          updatedContent = updatedContent.replace(/{{serviceStartDate}}/g, startDate.toLocaleDateString());
          updatedContent = updatedContent.replace(/{{serviceEndDate}}/g, endDate.toLocaleDateString());
        }
      }
      
      setContent(updatedContent);
    }
  }, [selectedPatientId, selectedSuperbillId, patients, superbills]);

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

      // If patient is selected, save to patient record
      if (selectedPatientId) {
        const timestamp = new Date().toISOString();
        const documentRef = `letters/${user.id}/${selectedPatientId}/${timestamp}.json`;
        
        const { error: saveError } = await supabase
          .from('patient_documents')
          .insert({
            patient_id: selectedPatientId,
            document_type: category,
            title,
            content: { text: content },
            created_by: user.id,
            created_at: timestamp
          });
          
        if (saveError) {
          toast({
            title: "Warning",
            description: "Template saved but failed to link to patient record",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Document saved to patient record",
          });
        }
      }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">New Template</SelectItem>
                {templates?.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Patient</SelectItem>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPatientId && (
              <Select value={selectedSuperbillId} onValueChange={setSelectedSuperbillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select superbill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Superbill</SelectItem>
                  {superbills
                    .filter(sb => {
                      const patient = patients.find(p => p.id === selectedPatientId);
                      return patient && sb.patientName === patient.name;
                    })
                    .map(superbill => (
                      <SelectItem key={superbill.id} value={superbill.id}>
                        {new Date(superbill.issueDate).toLocaleDateString()} ({superbill.visits.length} visits)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
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
        <Button variant="outline" onClick={onSave}>Cancel</Button>
        <Button onClick={handleSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
}
