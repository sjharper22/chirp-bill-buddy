
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, PlusCircle } from "lucide-react";

interface MultiSelectComplaintsProps {
  value: string[];
  onChange: (value: string[]) => void;
  availableOptions: string[];
}

export function MultiSelectComplaints({
  value = [],
  onChange,
  availableOptions = [],
}: MultiSelectComplaintsProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customComplaint, setCustomComplaint] = useState("");

  const handleCheckboxChange = (checked: boolean | "indeterminate", option: string) => {
    if (checked === "indeterminate") return;
    
    if (checked) {
      onChange([...value, option]);
    } else {
      onChange(value.filter(item => item !== option));
    }
  };

  const addCustomComplaint = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    if (!customComplaint.trim()) return;
    
    // Only add if not already in the list
    if (!value.includes(customComplaint.trim())) {
      onChange([...value, customComplaint.trim()]);
      setCustomComplaint("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      addCustomComplaint();
    }
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableOptions.map((option) => (
          <div key={option} className="flex items-start space-x-2">
            <Checkbox
              id={`complaint-${option}`}
              checked={value.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(checked, option)}
            />
            <Label
              htmlFor={`complaint-${option}`}
              className="text-sm cursor-pointer leading-tight"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>

      {showCustomInput ? (
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Enter custom complaint..."
            value={customComplaint}
            onChange={(e) => setCustomComplaint(e.target.value)}
            className="flex-1"
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            size="sm"
            onClick={(e) => addCustomComplaint(e)}
            disabled={!customComplaint.trim()}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              setShowCustomInput(false);
              setCustomComplaint("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button" // Explicitly set type to button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            setShowCustomInput(true);
          }}
          className="mt-3"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Custom Complaint
        </Button>
      )}
    </div>
  );
}
