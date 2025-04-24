
import { Button } from "@/components/ui/button";
import { PatientWithSuperbills } from "./types";

interface GroupStatsProps {
  selectedPatients: PatientWithSuperbills[];
  onClearSelection: () => void;
}

export function GroupStats({ selectedPatients, onClearSelection }: GroupStatsProps) {
  const groupTotalPatients = selectedPatients.length;
  const groupTotalVisits = selectedPatients.reduce((total, patient) => total + patient.totalVisits, 0);
  const groupTotalAmount = selectedPatients.reduce((total, patient) => total + patient.totalAmount, 0);

  if (selectedPatients.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
      <div className="text-sm font-medium mr-2">
        <span className="px-2 py-1 bg-primary/10 rounded-md">
          {groupTotalPatients} Patient{groupTotalPatients !== 1 ? 's' : ''}
        </span>
        <span className="px-2 py-1 bg-primary/10 rounded-md ml-2">
          {groupTotalVisits} Visit{groupTotalVisits !== 1 ? 's' : ''}
        </span>
        <span className="px-2 py-1 bg-primary/10 rounded-md ml-2">
          ${groupTotalAmount.toFixed(2)}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClearSelection}
        className="text-xs"
      >
        Clear Selection
      </Button>
    </div>
  );
}
