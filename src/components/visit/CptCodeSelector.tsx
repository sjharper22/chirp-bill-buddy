
import { Visit } from "@/types/superbill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { commonCPTCodes } from "@/lib/utils/superbill-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CptCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function CptCodeSelector({ visit, onVisitChange }: CptCodeSelectorProps) {
  const addCptCode = (code: string) => {
    if (!visit.cptCodes.includes(code)) {
      onVisitChange({ ...visit, cptCodes: [...visit.cptCodes, code] });
    }
  };

  const removeCptCode = (code: string) => {
    onVisitChange({ ...visit, cptCodes: visit.cptCodes.filter(c => c !== code) });
  };

  return (
    <div className="mt-3">
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2">CPT Codes:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Add CPT</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
            {commonCPTCodes.map(code => (
              <DropdownMenuItem
                key={code.value}
                onClick={() => addCptCode(code.value)}
                disabled={visit.cptCodes.includes(code.value)}
              >
                {code.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
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
