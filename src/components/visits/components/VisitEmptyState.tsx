import { PatientProfile } from "@/types/patient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface VisitEmptyStateProps {
  patient: PatientProfile;
  onAddVisit: () => void;
}

export function VisitEmptyState({ patient, onAddVisit }: VisitEmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h4 className="text-lg font-medium mb-2">No visits recorded</h4>
        <p className="text-muted-foreground mb-4">
          Add visits for {patient.name} to track their care history.
        </p>
        <Button onClick={onAddVisit}>
          <Plus className="mr-2 h-4 w-4" />
          Add First Visit
        </Button>
      </CardContent>
    </Card>
  );
}