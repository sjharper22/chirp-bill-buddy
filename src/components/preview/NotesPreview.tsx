
import { Visit } from "@/types/superbill";
import { formatDate } from "@/lib/utils/superbill-utils";

interface NotesPreviewProps {
  visits: Visit[];
}

export function NotesPreview({ visits }: NotesPreviewProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Notes</h3>
      <div className="border rounded-lg p-3 min-h-20 bg-muted/30 text-sm">
        {visits.some(v => v.notes || (v.mainComplaints && v.mainComplaints.length > 0)) ? (
          <div className="space-y-4">
            {visits.map((visit) => (
              (visit.notes || (visit.mainComplaints && visit.mainComplaints.length > 0)) && (
                <div key={visit.id} className="pb-3 last:pb-0 border-b last:border-0">
                  <div className="font-medium mb-1">{formatDate(visit.date)}</div>
                  {visit.mainComplaints && visit.mainComplaints.length > 0 && (
                    <div><em>Main Complaints: </em>{visit.mainComplaints.join(', ')}</div>
                  )}
                  {visit.notes && <div className="mt-1">{visit.notes}</div>}
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No notes</p>
        )}
      </div>
    </div>
  );
}
