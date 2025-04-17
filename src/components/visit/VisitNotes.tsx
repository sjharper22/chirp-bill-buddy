
import { Visit } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface VisitNotesProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  initialShowNotes?: boolean;
}

export function VisitNotes({ visit, onVisitChange, initialShowNotes = false }: VisitNotesProps) {
  const [showNotes, setShowNotes] = useState(initialShowNotes);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onVisitChange({ ...visit, notes: e.target.value });
  };

  return (
    <div className="mt-3">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowNotes(!showNotes)}
        className="text-xs p-0 h-auto"
      >
        {showNotes ? "Hide Notes" : "Add Notes"}
      </Button>
      
      {showNotes && (
        <Textarea
          placeholder="Visit notes..."
          value={visit.notes || ""}
          onChange={handleNotesChange}
          className="mt-2"
        />
      )}
    </div>
  );
}
