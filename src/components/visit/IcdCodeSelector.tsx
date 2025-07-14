
import { Visit } from "@/types/superbill";
import { Badge } from "@/components/ui/badge";
import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { commonICD10Codes } from "@/lib/utils/medical-codes";
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
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface IcdCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function IcdCodeSelector({ visit, onVisitChange }: IcdCodeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  const toggleIcdCode = (code: string) => {
    const isSelected = visit.icdCodes.includes(code);
    if (isSelected) {
      onVisitChange({ 
        ...visit, 
        icdCodes: visit.icdCodes.filter(c => c !== code) 
      });
    } else {
      onVisitChange({ 
        ...visit, 
        icdCodes: [...visit.icdCodes, code] 
      });
    }
  };

  const handleAICodeSuggestions = (aiContent: string) => {
    const codeMatches = aiContent.match(/\b[A-Z]\d{2}(?:\.\d{1,3})?\b/g) || [];
    const newCodes = codeMatches.filter(code => !visit.icdCodes.includes(code));
    
    if (newCodes.length > 0) {
      onVisitChange({ ...visit, icdCodes: [...visit.icdCodes, ...newCodes] });
    }
  };

  const generateTreatmentDescription = () => {
    const complaints = visit.mainComplaints.length > 0 ? `Chief complaints: ${visit.mainComplaints.join(', ')}` : '';
    const existingCpts = visit.cptCodes.length > 0 ? `Existing CPT codes: ${visit.cptCodes.join(', ')}` : '';
    const notes = visit.notes ? `Notes: ${visit.notes}` : '';
    
    return [complaints, existingCpts, notes].filter(Boolean).join('. ');
  };

  // Organize codes by category
  const spinalCodes = commonICD10Codes.filter(code => 
    code.value.startsWith('M99') || code.value.startsWith('M54')
  );
  
  const extremityCodes = commonICD10Codes.filter(code => 
    code.value.startsWith('M25') || code.value.startsWith('M79.67')
  );
  
  const sprainStrainCodes = commonICD10Codes.filter(code => 
    code.value.startsWith('S13') || code.value.startsWith('S16') || 
    code.value.startsWith('S23') || code.value.startsWith('S33') || 
    code.value.startsWith('S39')
  );
  
  const customCodes = commonICD10Codes.filter(code => 
    !spinalCodes.includes(code) && !extremityCodes.includes(code) && !sprainStrainCodes.includes(code)
  );

  const filterCodes = (codes: typeof commonICD10Codes) => {
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
        <span className="text-sm font-medium mr-2">ICD-10 Codes:</span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Select ICD-10 Codes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select ICD-10 Codes</DialogTitle>
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

              <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-[50vh]">
                {/* Spinal Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Spinal Codes</h3>
                  <div className="space-y-2">
                    {filterCodes(spinalCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.icdCodes.includes(code.value)}
                          onCheckedChange={() => toggleIcdCode(code.value)}
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

                {/* Extremity Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Extremity Codes</h3>
                  <div className="space-y-2">
                    {filterCodes(extremityCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.icdCodes.includes(code.value)}
                          onCheckedChange={() => toggleIcdCode(code.value)}
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

                {/* Sprain/Strain Codes */}
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-primary">Sprain/Strain Codes</h3>
                  <div className="space-y-2">
                    {filterCodes(sprainStrainCodes).map(code => (
                      <div key={code.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={code.value}
                          checked={visit.icdCodes.includes(code.value)}
                          onCheckedChange={() => toggleIcdCode(code.value)}
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

                {/* Custom Codes */}
                {filterCodes(customCodes).length > 0 && (
                  <div className="col-span-3">
                    <h3 className="font-semibold text-sm mb-3 text-primary">Other Codes</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {filterCodes(customCodes).map(code => (
                        <div key={code.value} className="flex items-start space-x-2">
                          <Checkbox
                            id={code.value}
                            checked={visit.icdCodes.includes(code.value)}
                            onCheckedChange={() => toggleIcdCode(code.value)}
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
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {treatmentDescription && (
          <AIAssistantButton
            type="code_suggestions"
            prompt={`Suggest appropriate ICD-10 codes for chiropractic diagnosis: ${treatmentDescription}`}
            context={{ visit, existingIcdCodes: visit.icdCodes }}
            onResult={handleAICodeSuggestions}
            size="sm"
          >
            Suggest Codes
          </AIAssistantButton>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {visit.icdCodes.map(code => {
          const codeInfo = commonICD10Codes.find(c => c.value === code);
          const displayLabel = codeInfo ? `${code} - ${codeInfo.label.split(' - ')[1]}` : code;
          return (
            <Badge 
              key={code} 
              variant="secondary" 
              className="cursor-pointer hover:bg-muted" 
              onClick={() => toggleIcdCode(code)}
            >
              {displayLabel} <span className="ml-1 text-muted-foreground">×</span>
            </Badge>
          );
        })}
        {visit.icdCodes.length === 0 && (
          <span className="text-sm text-muted-foreground">No ICD-10 codes selected</span>
        )}
      </div>
    </div>
  );
}
