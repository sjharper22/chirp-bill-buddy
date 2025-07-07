import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { Visit } from "@/types/superbill";
import { CptCodeEntry } from "@/types/cpt-entry";
import { CptCodeSelector } from "./CptCodeSelector";

interface CptCodeTableActionsProps {
  visit: Visit;
  existingEntries: CptCodeEntry[];
  onCodeAdd: (code: string, description: string, fee?: number) => void;
  onAISuggestions: (aiContent: string) => void;
}

export function CptCodeTableActions({ 
  visit, 
  existingEntries, 
  onCodeAdd, 
  onAISuggestions 
}: CptCodeTableActionsProps) {
  const generateTreatmentDescription = () => {
    const complaints = visit.mainComplaints.length > 0 ? `Chief complaints: ${visit.mainComplaints.join(', ')}` : '';
    const existingIcds = visit.icdCodes.length > 0 ? `Existing ICD codes: ${visit.icdCodes.join(', ')}` : '';
    const notes = visit.notes ? `Notes: ${visit.notes}` : '';
    
    return [complaints, existingIcds, notes].filter(Boolean).join('. ');
  };

  const treatmentDescription = generateTreatmentDescription();

  return (
    <div className="flex gap-2">
      <CptCodeSelector onCodeSelect={onCodeAdd} />
      
      {treatmentDescription && (
        <AIAssistantButton
          type="code_suggestions"
          prompt={`Suggest appropriate CPT codes with descriptions and typical fees for chiropractic treatment: ${treatmentDescription}`}
          context={{ visit, existingCptCodes: existingEntries.map(e => e.code) }}
          onResult={onAISuggestions}
          size="sm"
        >
          AI Suggest
        </AIAssistantButton>
      )}
    </div>
  );
}