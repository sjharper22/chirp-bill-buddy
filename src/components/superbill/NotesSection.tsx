
import { Visit } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";

interface NotesSectionProps {
  visits: Visit[];
}

export function NotesSection({ visits }: NotesSectionProps) {
  const hasNotes = visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0));
  
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Notes</h3>
      <div className="border rounded-lg p-3 min-h-20 bg-muted/30 text-sm">
        {hasNotes ? (
          visits.map((visit, index) => (
            (visit.notes || (visit.mainComplaints && visit.mainComplaints.length > 0)) && (
              <div key={visit.id} className="mb-2">
                <span className="font-medium">{formatDate(visit.date)}:</span>
                {visit.mainComplaints && visit.mainComplaints.length > 0 && (
                  <div><em>Main Complaints: </em>{visit.mainComplaints.join(', ')}</div>
                )}
                {visit.notes && <div>{visit.notes}</div>}
              </div>
            )
          ))
        ) : (
          <p className="text-muted-foreground italic">No notes</p>
        )}
      </div>
    </div>
  );
}
