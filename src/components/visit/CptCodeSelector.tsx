
import { Visit } from "@/types/superbill";
import { Badge } from "@/components/ui/badge";
import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { commonCPTCodes } from "@/lib/utils/medical-codes";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface CptCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function CptCodeSelector({ visit, onVisitChange }: CptCodeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleCptCode = (code: string) => {
    const isSelected = visit.cptCodes.includes(code);
    if (isSelected) {
      onVisitChange({ 
        ...visit, 
        cptCodes: visit.cptCodes.filter(c => c !== code) 
      });
    } else {
      onVisitChange({ 
        ...visit, 
        cptCodes: [...visit.cptCodes, code] 
      });
    }
  };

  const handleAICodeSuggestions = (aiContent: string) => {
    const codeMatches = aiContent.match(/\b\d{5}\b/g) || [];
    const newCodes = codeMatches.filter(code => !visit.cptCodes.includes(code));
    
    if (newCodes.length > 0) {
      onVisitChange({ ...visit, cptCodes: [...visit.cptCodes, ...newCodes] });
    }
  };

  const generateTreatmentDescription = () => {
    const complaints = visit.mainComplaints.length > 0 ? `Chief complaints: ${visit.mainComplaints.join(', ')}` : '';
    const existingIcds = visit.icdCodes.length > 0 ? `Existing ICD codes: ${visit.icdCodes.join(', ')}` : '';
    const notes = visit.notes ? `Notes: ${visit.notes}` : '';
    
    return [complaints, existingIcds, notes].filter(Boolean).join('. ');
  };

  // Organize codes by category
  const evaluationCodes = commonCPTCodes.filter(code => 
    code.value.startsWith('992')
  );
  
  const cmtCodes = commonCPTCodes.filter(code => 
    code.value.startsWith('989')
  );
  
  const therapyCodes = commonCPTCodes.filter(code => 
    code.value.startsWith('970') || code.value.startsWith('971') || code.value.startsWith('975')
  );
  
  const imagingCodes = commonCPTCodes.filter(code => 
    code.value.startsWith('720')
  );

  const filterCodes = (codes: typeof commonCPTCodes) => {
    if (!searchValue) return codes;
    return codes.filter(code => 
      code.value.toLowerCase().includes(searchValue.toLowerCase()) ||
      code.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const treatmentDescription = generateTreatmentDescription();

  return (
    <div className="mt-3">
      <div className="flex items-center mb-2 gap-2">
        <span className="text-sm font-medium mr-2">CPT Codes:</span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Select CPT Codes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select CPT Codes</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search codes..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[50vh]">
                {/* Evaluation Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Evaluation & Management</h3>
                  <div className="space-y-2">
                    {filterCodes(evaluationCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.cptCodes.includes(code.value)}
                          onCheckedChange={() => toggleCptCode(code.value)}
                        />
                        <label 
                          htmlFor={code.value}
                          className="text-xs leading-relaxed cursor-pointer flex-1"
                        >
                          <span className="font-mono font-medium text-primary">{code.value}</span>
                          <br />
                          <span className="text-muted-foreground">{code.label.split(' - ')[1]}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CMT Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Chiropractic Manipulation</h3>
                  <div className="space-y-2">
                    {filterCodes(cmtCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.cptCodes.includes(code.value)}
                          onCheckedChange={() => toggleCptCode(code.value)}
                        />
                        <label 
                          htmlFor={code.value}
                          className="text-xs leading-relaxed cursor-pointer flex-1"
                        >
                          <span className="font-mono font-medium text-primary">{code.value}</span>
                          <br />
                          <span className="text-muted-foreground">{code.label.split(' - ')[1]}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Therapy Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Physical Therapy</h3>
                  <div className="space-y-2">
                    {filterCodes(therapyCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.cptCodes.includes(code.value)}
                          onCheckedChange={() => toggleCptCode(code.value)}
                        />
                        <label 
                          htmlFor={code.value}
                          className="text-xs leading-relaxed cursor-pointer flex-1"
                        >
                          <span className="font-mono font-medium text-primary">{code.value}</span>
                          <br />
                          <span className="text-muted-foreground">{code.label.split(' - ')[1]}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Imaging Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Imaging</h3>
                  <div className="space-y-2">
                    {filterCodes(imagingCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.cptCodes.includes(code.value)}
                          onCheckedChange={() => toggleCptCode(code.value)}
                        />
                        <label 
                          htmlFor={code.value}
                          className="text-xs leading-relaxed cursor-pointer flex-1"
                        >
                          <span className="font-mono font-medium text-primary">{code.value}</span>
                          <br />
                          <span className="text-muted-foreground">{code.label.split(' - ')[1]}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {treatmentDescription && (
          <AIAssistantButton
            type="code_suggestions"
            prompt={`Suggest appropriate CPT codes for chiropractic treatment: ${treatmentDescription}`}
            context={{ visit, existingCptCodes: visit.cptCodes }}
            onResult={handleAICodeSuggestions}
            size="sm"
          >
            Suggest Codes
          </AIAssistantButton>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {visit.cptCodes.map(code => {
          const codeInfo = commonCPTCodes.find(c => c.value === code);
          const displayLabel = codeInfo ? `${code} - ${codeInfo.label.split(' - ')[1]}` : code;
          return (
            <Badge 
              key={code} 
              variant="secondary" 
              className="cursor-pointer hover:bg-muted" 
              onClick={() => toggleCptCode(code)}
            >
              {displayLabel} <span className="ml-1 text-muted-foreground">×</span>
            </Badge>
          );
        })}
        {visit.cptCodes.length === 0 && (
          <span className="text-sm text-muted-foreground">No CPT codes selected</span>
        )}
      </div>
    </div>
  );
}
