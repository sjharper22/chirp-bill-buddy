
import { useState } from "react";
import { Visit } from "@/types/superbill";
import { CptCodeEntry } from "@/types/cpt-entry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";
import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { commonCPTCodes } from "@/lib/utils/superbill-utils";
import { formatCurrency } from "@/lib/utils/superbill-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command } from "cmdk";

interface CptCodeTableSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function CptCodeTableSelector({ visit, onVisitChange }: CptCodeTableSelectorProps) {
  const [showCodeSelector, setShowCodeSelector] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const cptEntries = visit.cptCodeEntries || [];
  const totalFee = cptEntries.reduce((sum, entry) => sum + entry.fee, 0);

  const addCptEntry = (code: string, description: string, fee: number = 0) => {
    const newEntry: CptCodeEntry = { code, description, fee };
    const updatedEntries = [...cptEntries, newEntry];
    const updatedVisit = {
      ...visit,
      cptCodeEntries: updatedEntries,
      fee: updatedEntries.reduce((sum, entry) => sum + entry.fee, 0)
    };
    onVisitChange(updatedVisit);
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
    const updatedVisit = {
      ...visit,
      cptCodeEntries: updatedEntries,
      fee: updatedEntries.reduce((sum, entry) => sum + entry.fee, 0)
    };
    onVisitChange(updatedVisit);
  };

  const filteredCodes = commonCPTCodes.filter(code => {
    const search = searchValue.toLowerCase();
    return (
      code.value.toLowerCase().includes(search) ||
      code.label.toLowerCase().includes(search)
    );
  });

  const handleCustomCodeAdd = () => {
    if (searchValue) {
      addCptEntry(searchValue.toUpperCase(), "Custom procedure", 0);
      setSearchValue("");
      setShowCodeSelector(false);
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

  const generateTreatmentDescription = () => {
    const complaints = visit.mainComplaints.length > 0 ? `Chief complaints: ${visit.mainComplaints.join(', ')}` : '';
    const existingIcds = visit.icdCodes.length > 0 ? `Existing ICD codes: ${visit.icdCodes.join(', ')}` : '';
    const notes = visit.notes ? `Notes: ${visit.notes}` : '';
    
    return [complaints, existingIcds, notes].filter(Boolean).join('. ');
  };

  const treatmentDescription = generateTreatmentDescription();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">CPT Codes & Procedures</CardTitle>
          <div className="flex gap-2">
            <Popover open={showCodeSelector} onOpenChange={setShowCodeSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add CPT Code
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="h-4 w-4 shrink-0 opacity-50" />
                    <input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search CPT codes..."
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredCodes.length > 0 ? (
                      filteredCodes.map(code => (
                        <div
                          key={code.value}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                          onClick={() => {
                            addCptEntry(code.value, code.label, 0);
                            setShowCodeSelector(false);
                            setSearchValue("");
                          }}
                        >
                          <div className="font-medium">{code.value}</div>
                          <div className="text-muted-foreground text-xs">{code.label}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground">
                        {searchValue ? (
                          <div className="space-y-2">
                            <p>No existing codes found.</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleCustomCodeAdd}
                            >
                              Add "{searchValue.toUpperCase()}" as custom code
                            </Button>
                          </div>
                        ) : (
                          "Type to search for CPT codes..."
                        )}
                      </div>
                    )}
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
            
            {treatmentDescription && (
              <AIAssistantButton
                type="code_suggestions"
                prompt={`Suggest appropriate CPT codes with descriptions and typical fees for chiropractic treatment: ${treatmentDescription}`}
                context={{ visit, existingCptCodes: cptEntries.map(e => e.code) }}
                onResult={handleAICodeSuggestions}
                size="sm"
              >
                AI Suggest
              </AIAssistantButton>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {cptEntries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No CPT codes added yet.</p>
            <p className="text-sm">Click "Add CPT Code" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPT Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32">Fee</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cptEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={entry.code}
                        onChange={(e) => updateCptEntry(index, { code: e.target.value.toUpperCase() })}
                        className="w-24"
                        placeholder="CPT"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={entry.description}
                        onChange={(e) => updateCptEntry(index, { description: e.target.value })}
                        placeholder="Procedure description"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={entry.fee}
                        onChange={(e) => updateCptEntry(index, { fee: parseFloat(e.target.value) || 0 })}
                        className="w-28"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCptEntry(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="text-right font-semibold">
                    Visit Total:
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(totalFee)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
