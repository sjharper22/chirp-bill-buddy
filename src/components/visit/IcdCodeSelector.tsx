
import { Visit } from "@/types/superbill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { commonICD10Codes } from "@/lib/utils/superbill-utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus } from "lucide-react";
import { useState } from "react";

interface IcdCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function IcdCodeSelector({ visit, onVisitChange }: IcdCodeSelectorProps) {
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const addIcdCode = (code: string) => {
    if (!visit.icdCodes.includes(code)) {
      onVisitChange({ ...visit, icdCodes: [...visit.icdCodes, code] });
    }
  };

  const removeIcdCode = (code: string) => {
    onVisitChange({ ...visit, icdCodes: visit.icdCodes.filter(c => c !== code) });
  };

  const handleAddCustomCode = () => {
    if (customCode) {
      addIcdCode(customCode.toUpperCase());
      setCustomCode("");
      setCustomDescription("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2">ICD-10 Codes:</span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCommandDialog(true)}
          >
            Search ICD-10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(!showCustomInput)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Custom
          </Button>
        </div>
      </div>

      {showCustomInput && (
        <div className="flex gap-2 mt-2">
          <div className="flex-1">
            <Input
              placeholder="Enter ICD-10 code (e.g., M54.5)"
              value={customCode}
              onChange={e => setCustomCode(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Description (optional)"
              value={customDescription}
              onChange={e => setCustomDescription(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAddCustomCode}
            className="h-20"
          >
            Add
          </Button>
        </div>
      )}

      <CommandDialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <Command>
          <CommandInput placeholder="Search ICD-10 codes..." />
          <CommandList>
            <CommandEmpty>No ICD-10 codes found.</CommandEmpty>
            <CommandGroup>
              {commonICD10Codes.map(code => (
                <CommandItem
                  key={code.value}
                  onSelect={() => {
                    addIcdCode(code.value);
                    setShowCommandDialog(false);
                  }}
                >
                  {code.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <div className="flex flex-wrap gap-2 mt-1">
        {visit.icdCodes.map(code => (
          <Badge key={code} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => removeIcdCode(code)}>
            {code} <span className="ml-1 text-muted-foreground">×</span>
          </Badge>
        ))}
        {visit.icdCodes.length === 0 && (
          <span className="text-sm text-muted-foreground">No ICD-10 codes selected</span>
        )}
      </div>
    </div>
  );
}
