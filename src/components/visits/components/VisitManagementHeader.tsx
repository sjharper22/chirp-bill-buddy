import { Visit } from "@/services/visitService";
import { PatientProfile } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VisitManagementHeaderProps {
  patient: PatientProfile;
  onAddVisit: () => void;
}

export function VisitManagementHeader({ patient, onAddVisit }: VisitManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Patient Visits</h3>
      <Button onClick={onAddVisit}>
        <Plus className="mr-2 h-4 w-4" />
        Add Visit
      </Button>
    </div>
  );
}