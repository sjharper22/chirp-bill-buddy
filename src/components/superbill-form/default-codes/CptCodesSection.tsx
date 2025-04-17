
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { commonCPTCodes } from "@/lib/utils/superbill-utils";

interface CptCodesSectionProps {
  defaultCptCodes: string[];
  onCodesChange: (codes: string[]) => void;
}

export function CptCodesSection({ defaultCptCodes, onCodesChange }: CptCodesSectionProps) {
  const handleCptCodeToggle = (code: string) => {
    const newCodes = defaultCptCodes.includes(code)
      ? defaultCptCodes.filter(c => c !== code)
      : [...defaultCptCodes, code];
    onCodesChange(newCodes);
  };

  return (
    <div className="space-y-4">
      <Label>Default CPT Codes</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {commonCPTCodes.map((code) => (
          <div key={code.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`cpt-${code.value}`}
              checked={defaultCptCodes.includes(code.value)}
              onCheckedChange={() => handleCptCodeToggle(code.value)}
            />
            <label
              htmlFor={`cpt-${code.value}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {code.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
