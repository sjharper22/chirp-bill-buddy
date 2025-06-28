
import { Superbill } from "@/types/superbill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { commonIcdCodes } from "@/lib/utils/superbill-utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface IcdCodesSectionProps {
  defaultIcdCodes: string[];
  onCodesChange: (codes: string[]) => void;
}

export function IcdCodesSection({ defaultIcdCodes, onCodesChange }: IcdCodesSectionProps) {
  const [customIcdCode, setCustomIcdCode] = useState("");
  const [customIcdDescription, setCustomIcdDescription] = useState("");
  const { toast } = useToast();

  const handleIcdCodeToggle = (code: string) => {
    const newCodes = defaultIcdCodes.includes(code)
      ? defaultIcdCodes.filter(c => c !== code)
      : [...defaultIcdCodes, code];
    onCodesChange(newCodes);
  };

  const handleAddCustomIcdCode = () => {
    if (customIcdCode && customIcdDescription) {
      const code = customIcdCode.toUpperCase();
      
      // Check if code already exists in the commonIcdCodes
      const existingCodeIndex = commonIcdCodes.findIndex(item => item.value === code);
      
      // If code doesn't exist in commonIcdCodes, add it
      if (existingCodeIndex === -1) {
        commonIcdCodes.push({
          value: code,
          label: `${code} - ${customIcdDescription}`
        });
      }
      
      // Add to selected codes if not already included
      if (!defaultIcdCodes.includes(code)) {
        onCodesChange([...defaultIcdCodes, code]);
        toast({
          title: "ICD Code Added",
          description: `${code} has been added to your default codes.`
        });
      }
      
      setCustomIcdCode("");
      setCustomIcdDescription("");
    }
  };

  return (
    <div className="space-y-4">
      <Label>Default ICD-10 Codes</Label>
      
      {/* Custom ICD code input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Custom ICD-10 code (e.g., M54.5)"
            value={customIcdCode}
            onChange={e => setCustomIcdCode(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Description"
            value={customIcdDescription}
            onChange={e => setCustomIcdDescription(e.target.value)}
          />
        </div>
        <Button 
          type="button"
          variant="outline"
          onClick={handleAddCustomIcdCode}
          className="h-20"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Group ICD codes by category */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Spinal Codes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonIcdCodes
              .filter(code => code.value.startsWith('M99') || code.value.startsWith('M54'))
              .map((code) => (
                <div key={code.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`icd-${code.value}`}
                    checked={defaultIcdCodes.includes(code.value)}
                    onCheckedChange={() => handleIcdCodeToggle(code.value)}
                  />
                  <label
                    htmlFor={`icd-${code.value}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {code.label}
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Extremity Codes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonIcdCodes
              .filter(code => code.value.startsWith('M25') || code.value.startsWith('M79'))
              .map((code) => (
                <div key={code.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`icd-${code.value}`}
                    checked={defaultIcdCodes.includes(code.value)}
                    onCheckedChange={() => handleIcdCodeToggle(code.value)}
                  />
                  <label
                    htmlFor={`icd-${code.value}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {code.label}
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Sprain/Strain Codes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonIcdCodes
              .filter(code => code.value.startsWith('S'))
              .map((code) => (
                <div key={code.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`icd-${code.value}`}
                    checked={defaultIcdCodes.includes(code.value)}
                    onCheckedChange={() => handleIcdCodeToggle(code.value)}
                  />
                  <label
                    htmlFor={`icd-${code.value}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {code.label}
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* Custom Codes Section - Show if there are any custom codes */}
        {commonIcdCodes.some(code => 
          !code.value.startsWith('M99') && 
          !code.value.startsWith('M54') && 
          !code.value.startsWith('M25') && 
          !code.value.startsWith('M79') && 
          !code.value.startsWith('S')
        ) && (
          <div>
            <h4 className="text-sm font-medium mb-2">Custom Codes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {commonIcdCodes
                .filter(code => 
                  !code.value.startsWith('M99') && 
                  !code.value.startsWith('M54') && 
                  !code.value.startsWith('M25') && 
                  !code.value.startsWith('M79') && 
                  !code.value.startsWith('S')
                )
                .map((code) => (
                  <div key={code.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`icd-${code.value}`}
                      checked={defaultIcdCodes.includes(code.value)}
                      onCheckedChange={() => handleIcdCodeToggle(code.value)}
                    />
                    <label
                      htmlFor={`icd-${code.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {code.label}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
