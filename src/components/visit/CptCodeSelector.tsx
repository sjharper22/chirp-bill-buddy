
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
import { Search, Settings, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CptCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function CptCodeSelector({ visit, onVisitChange }: CptCodeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [customCptCodes, setCustomCptCodes] = useState<Array<{value: string, label: string}>>([]);
  const { toast } = useToast();

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

  const addCustomCode = () => {
    if (!searchValue.trim()) return;
    
    const codeValue = searchValue.trim();
    const newCode = {
      value: codeValue,
      label: `${codeValue} - Custom Code`
    };
    
    // Add to custom codes list
    setCustomCptCodes(prev => [...prev, newCode]);
    
    // Automatically select the new code
    onVisitChange({
      ...visit,
      cptCodes: [...visit.cptCodes, codeValue]
    });
    
    // Clear search
    setSearchValue("");
    
    toast({
      title: "Custom code added",
      description: `${codeValue} has been added and selected.`
    });
  };

  const generateTreatmentDescription = () => {
    const complaints = visit.mainComplaints.length > 0 ? `Chief complaints: ${visit.mainComplaints.join(', ')}` : '';
    const existingIcds = visit.icdCodes.length > 0 ? `Existing ICD codes: ${visit.icdCodes.join(', ')}` : '';
    const notes = visit.notes ? `Notes: ${visit.notes}` : '';
    
    return [complaints, existingIcds, notes].filter(Boolean).join('. ');
  };

  const filterCodes = (codes: typeof commonCPTCodes) => {
    if (!searchValue) return codes;
    return codes.filter(code => 
      code.value.toLowerCase().includes(searchValue.toLowerCase()) ||
      code.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  // Combine default codes with custom codes
  const allCodes = [...commonCPTCodes, ...customCptCodes];

  // Organize codes by category
  const evaluationCodes = allCodes.filter(code => 
    code.value.startsWith('992')
  );
  
  const cmtCodes = allCodes.filter(code => 
    code.value.startsWith('989')
  );
  
  const therapyCodes = allCodes.filter(code => 
    code.value.startsWith('970') || code.value.startsWith('971') || code.value.startsWith('975')
  );
  
  const imagingCodes = allCodes.filter(code => 
    code.value.startsWith('720')
  );

  const customCodes = allCodes.filter(code => 
    !evaluationCodes.includes(code) && !cmtCodes.includes(code) && 
    !therapyCodes.includes(code) && !imagingCodes.includes(code)
  );

  // Check if search has results
  const hasSearchResults = searchValue && (
    filterCodes(evaluationCodes).length > 0 ||
    filterCodes(cmtCodes).length > 0 ||
    filterCodes(therapyCodes).length > 0 ||
    filterCodes(imagingCodes).length > 0 ||
    filterCodes(customCodes).length > 0
  );

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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search codes..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchValue && !hasSearchResults && (
                  <Button 
                    onClick={addCustomCode}
                    variant="outline" 
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    Add "{searchValue}"
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[50vh]">
                {/* Custom Codes Section */}
                {filterCodes(customCodes).length > 0 && (
                  <div className="col-span-2">
                    <h3 className="font-semibold text-sm mb-3 text-primary">Custom Codes</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {filterCodes(customCodes).map(code => (
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
                )}
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
          const codeInfo = [...commonCPTCodes, ...customCptCodes].find(c => c.value === code);
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
