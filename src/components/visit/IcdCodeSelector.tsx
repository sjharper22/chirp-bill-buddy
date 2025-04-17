
import { Visit } from "@/types/superbill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { commonICD10Codes } from "@/lib/utils/superbill-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IcdCodeSelectorProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function IcdCodeSelector({ visit, onVisitChange }: IcdCodeSelectorProps) {
  const addIcdCode = (code: string) => {
    if (!visit.icdCodes.includes(code)) {
      onVisitChange({ ...visit, icdCodes: [...visit.icdCodes, code] });
    }
  };

  const removeIcdCode = (code: string) => {
    onVisitChange({ ...visit, icdCodes: visit.icdCodes.filter(c => c !== code) });
  };

  return (
    <div className="mt-3">
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2">ICD-10 Codes:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Add ICD-10</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
            {commonICD10Codes.map(code => (
              <DropdownMenuItem
                key={code.value}
                onClick={() => addIcdCode(code.value)}
                disabled={visit.icdCodes.includes(code.value)}
              >
                {code.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
