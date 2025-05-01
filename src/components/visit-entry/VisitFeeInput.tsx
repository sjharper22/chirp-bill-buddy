
import { Visit } from "@/types/superbill";
import { Input } from "@/components/ui/input";

interface VisitFeeInputProps {
  visit: Visit;
  onChange: (updatedVisit: Visit) => void;
}

export function VisitFeeInput({ visit, onChange }: VisitFeeInputProps) {
  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ ...visit, fee: value });
  };

  return (
    <div className="w-full sm:w-auto">
      <Input
        type="number"
        placeholder="Fee"
        value={visit.fee || ""}
        onChange={handleFeeChange}
        className="w-full sm:w-[120px]"
        min={0}
        step={0.01}
      />
    </div>
  );
}
