import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command } from "cmdk";
import { commonCPTCodes } from "@/lib/utils/superbill-utils";

interface CptCodeSelectorProps {
  onCodeSelect: (code: string, description: string, fee?: number) => void;
}

export function CptCodeSelector({ onCodeSelect }: CptCodeSelectorProps) {
  const [showCodeSelector, setShowCodeSelector] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredCodes = commonCPTCodes.filter(code => {
    const search = searchValue.toLowerCase();
    return (
      code.value.toLowerCase().includes(search) ||
      code.label.toLowerCase().includes(search)
    );
  });

  const handleCustomCodeAdd = () => {
    if (searchValue) {
      onCodeSelect(searchValue.toUpperCase(), "Custom procedure", 0);
      setSearchValue("");
      setShowCodeSelector(false);
    }
  };

  return (
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
                    onCodeSelect(code.value, code.label, 0);
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
  );
}