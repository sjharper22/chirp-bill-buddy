import { Visit } from "@/services/visitService";
import { VisitCard } from "./VisitCard";

interface VisitListProps {
  visits: Visit[];
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visitId: string) => void;
}

export function VisitList({ visits, onEditVisit, onDeleteVisit }: VisitListProps) {
  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <VisitCard
          key={visit.id}
          visit={visit}
          onEdit={onEditVisit}
          onDelete={onDeleteVisit}
        />
      ))}
    </div>
  );
}