
import { Visit } from "@/types/superbill";
import { CptCodeEntry } from "@/types/cpt-entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CptCodeTable } from "./cpt-code-table/CptCodeTable";
import { CptCodeTableActions } from "./cpt-code-table/CptCodeTableActions";

interface CptCodeTableSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function CptCodeTableSelector({ visit, onVisitChange }: CptCodeTableSelectorProps) {
  const cptEntries = visit.cptCodeEntries || [];

  const addCptEntry = (code: string, description: string, fee: number = 0) => {
    const newEntry: CptCodeEntry = { code, description, fee };
    const updatedEntries = [...cptEntries, newEntry];
    
    // If there's a total visit fee, redistribute it among all entries
    if (visit.fee && visit.fee > 0) {
      const feePerCode = visit.fee / updatedEntries.length;
      const redistributedEntries = updatedEntries.map(entry => ({
        ...entry,
        fee: feePerCode
      }));
      const updatedVisit = {
        ...visit,
        cptCodeEntries: redistributedEntries
      };
      onVisitChange(updatedVisit);
    } else {
      const updatedVisit = {
        ...visit,
        cptCodeEntries: updatedEntries,
        fee: updatedEntries.reduce((sum, entry) => sum + entry.fee, 0)
      };
      onVisitChange(updatedVisit);
    }
  };

  const updateCptEntry = (index: number, updates: Partial<CptCodeEntry>) => {
    const updatedEntries = cptEntries.map((entry, i) => 
      i === index ? { ...entry, ...updates } : entry
    );
    const updatedVisit = {
      ...visit,
      cptCodeEntries: updatedEntries,
      fee: updatedEntries.reduce((sum, entry) => sum + entry.fee, 0)
    };
    onVisitChange(updatedVisit);
  };

  const removeCptEntry = (index: number) => {
    const updatedEntries = cptEntries.filter((_, i) => i !== index);
    
    // If there's a total visit fee, redistribute it among remaining entries
    if (visit.fee && visit.fee > 0 && updatedEntries.length > 0) {
      const feePerCode = visit.fee / updatedEntries.length;
      const redistributedEntries = updatedEntries.map(entry => ({
        ...entry,
        fee: feePerCode
      }));
      const updatedVisit = {
        ...visit,
        cptCodeEntries: redistributedEntries
      };
      onVisitChange(updatedVisit);
    } else {
      const updatedVisit = {
        ...visit,
        cptCodeEntries: updatedEntries,
        fee: updatedEntries.reduce((sum, entry) => sum + entry.fee, 0)
      };
      onVisitChange(updatedVisit);
    }
  };

  const handleAICodeSuggestions = (aiContent: string) => {
    // Parse AI response for CPT codes and descriptions
    const lines = aiContent.split('\n');
    lines.forEach(line => {
      const codeMatch = line.match(/(\d{5})/);
      const descMatch = line.match(/:\s*(.+?)(?:\s*-\s*\$|\s*$)/);
      const feeMatch = line.match(/\$(\d+(?:\.\d{2})?)/);
      
      if (codeMatch) {
        const code = codeMatch[1];
        const description = descMatch ? descMatch[1].trim() : "AI suggested procedure";
        const fee = feeMatch ? parseFloat(feeMatch[1]) : 0;
        
        // Only add if not already present
        if (!cptEntries.some(entry => entry.code === code)) {
          addCptEntry(code, description, fee);
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">CPT Codes & Procedures</CardTitle>
          <CptCodeTableActions
            visit={visit}
            existingEntries={cptEntries}
            onCodeAdd={addCptEntry}
            onAISuggestions={handleAICodeSuggestions}
          />
        </div>
      </CardHeader>
      <CardContent>
        <CptCodeTable
          entries={cptEntries}
          onUpdateEntry={updateCptEntry}
          onRemoveEntry={removeCptEntry}
        />
      </CardContent>
    </Card>
  );
}
