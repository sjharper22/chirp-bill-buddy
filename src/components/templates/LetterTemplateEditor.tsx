
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { usePatient } from "@/context/patient-context";
import { useSuperbill } from "@/context/superbill-context";
import { TemplateHeaderControls } from "./editor/TemplateHeaderControls";
import { TemplateEditor } from "./editor/TemplateEditor";
import { useTemplateSave } from "@/hooks/use-template-save";
import { PatientProfile } from "@/types/patient";
import { Superbill } from "@/types/superbill";

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

interface LetterTemplateEditorProps {
  patientData?: PatientProfile;
  superbillData?: Superbill;
  onSave?: () => void;
}

export function LetterTemplateEditor({ 
  patientData, 
  superbillData,
  onSave 
}: LetterTemplateEditorProps) {
  const { patients } = usePatient();
  const { superbills } = useSuperbill();
  const [title, setTitle] = useState("Out-of-Network Insurance Guide");
  const [category, setCategory] = useState<"cover_letter" | "appeal_letter" | "general">("cover_letter");
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedSuperbillId, setSelectedSuperbillId] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const { saveTemplate, totalCharges, setTotalCharges } = useTemplateSave();

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

  // Set initial data from props
  useEffect(() => {
    if (patientData) {
      setSelectedPatientId(patientData.id);
    }
    if (superbillData) {
      setSelectedSuperbillId(superbillData.id);
    }
  }, [patientData, superbillData]);

  // Update template content when selections change
  useEffect(() => {
    if (selectedTemplateId && templates) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setTitle(template.title);
        const templateContent = typeof template.content === 'object' && template.content !== null 
          ? (template.content as any).text || JSON.stringify(template.content)
          : String(template.content);
        setContent(templateContent);
        setCategory(template.category as "cover_letter" | "appeal_letter" | "general");
      }
    }
  }, [selectedTemplateId, templates]);

  // Update template variables
  useEffect(() => {
    if (selectedPatientId || selectedSuperbillId) {
      let updatedContent = content;
      
      if (selectedPatientId) {
        const patient = patients.find(p => p.id === selectedPatientId);
        if (patient) {
          updatedContent = updatedContent.replace(/{{patientName}}/g, patient.name);
          updatedContent = updatedContent.replace(/{{patientDOB}}/g, patient.dob.toLocaleDateString());
        }
      }
      
      if (selectedSuperbillId) {
        const superbill = superbills.find(sb => sb.id === selectedSuperbillId);
        if (superbill) {
          const visitCount = superbill.visits.length;
          const totalChargesValue = superbill.visits.reduce((total, visit) => total + visit.fee, 0);
          setTotalCharges(totalChargesValue.toFixed(2));
          
          const visitDates = superbill.visits.map(v => new Date(v.date).getTime());
          const startDate = new Date(Math.min(...visitDates));
          const endDate = new Date(Math.max(...visitDates));
          
          updatedContent = updatedContent.replace(/{{visitCount}}/g, visitCount.toString());
          updatedContent = updatedContent.replace(/{{totalCharges}}/g, totalChargesValue.toFixed(2));
          updatedContent = updatedContent.replace(/{{serviceStartDate}}/g, startDate.toLocaleDateString());
          updatedContent = updatedContent.replace(/{{serviceEndDate}}/g, endDate.toLocaleDateString());
        }
      }
      
      setContent(updatedContent);
    }
  }, [selectedPatientId, selectedSuperbillId, patients, superbills, content, setTotalCharges]);

  const handleSaveTemplate = async () => {
    const success = await saveTemplate({
      title,
      content,
      category,
      selectedPatientId,
      user: { id: 'dummy' },
    });

    if (success && onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-4">
      <TemplateHeaderControls
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        selectedSuperbillId={selectedSuperbillId}
        setSelectedSuperbillId={setSelectedSuperbillId}
        templates={templates || []}
        patients={patients}
        superbills={superbills}
      />

      <TemplateEditor 
        content={content}
        setContent={setContent}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onSave}>Cancel</Button>
        <Button onClick={handleSaveTemplate}>Save Template</Button>
      </div>
    </div>
  );
}
