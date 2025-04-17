
import { Visit } from "@/types/superbill";
import { Badge } from "@/components/ui/badge";
import { commonCPTCodes } from "@/lib/utils/superbill-utils";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

interface CptCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function CptCodeSelector({ visit, onVisitChange }: CptCodeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const addCptCode = (code: string) => {
    if (!visit.cptCodes.includes(code)) {
      onVisitChange({ ...visit, cptCodes: [...visit.cptCodes, code] });
      setInputValue("");
    }
  };

  const removeCptCode = (code: string) => {
    onVisitChange({ ...visit, cptCodes: visit.cptCodes.filter(c => c !== code) });
  };

  const filteredCodes = commonCPTCodes.filter(code => {
    const search = inputValue.toLowerCase();
    return (
      code.value.toLowerCase().includes(search) ||
      code.label.toLowerCase().includes(search)
    );
  });

  const handleCustomCodeAdd = () => {
    if (inputValue && !visit.cptCodes.includes(inputValue.toUpperCase())) {
      addCptCode(inputValue.toUpperCase());
      setOpen(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium mr-2">CPT Codes:</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[300px] justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search or add CPT code
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <div className="flex items-center border-b px-3">
                <Search className="h-4 w-4 shrink-0 opacity-50" />
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type to search..."
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {filteredCodes.length > 0 ? (
                  filteredCodes.map(code => (
                    <div
                      key={code.value}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                      onClick={() => {
                        addCptCode(code.value);
                        setOpen(false);
                      }}
                    >
                      {code.label}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    {inputValue ? (
                      <div className="space-y-2">
                        <p>No existing codes found.</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleCustomCodeAdd}
                        >
                          Add "{inputValue.toUpperCase()}" as custom code
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
      </div>

      <div className="flex flex-wrap gap-2">
        {visit.cptCodes.map(code => (
          <Badge key={code} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => removeCptCode(code)}>
            {code} <span className="ml-1 text-muted-foreground">×</span>
          </Badge>
        ))}
        {visit.cptCodes.length === 0 && (
          <span className="text-sm text-muted-foreground">No CPT codes selected</span>
        )}
      </div>
    </div>
  );
}
