
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

  // Prevent form submission when clicking the button
  const handleToggleNotes = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default button action
    setShowNotes(!showNotes);
  };

  return (
    <div className="mt-3">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleToggleNotes}
        className="text-xs p-0 h-auto"
        type="button" // Explicitly set button type to avoid form submission
      >
        {showNotes ? "Hide Notes" : "Add Notes"}
      </Button>
      
      {showNotes && (
        <Textarea
          placeholder="Visit notes..."
          value={visit.notes || ""}
          onChange={handleNotesChange}
          className="mt-2"
          // Prevent the Enter key from submitting the form
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.stopPropagation();
            }
          }}
        />
      )}
    </div>
  );
}
