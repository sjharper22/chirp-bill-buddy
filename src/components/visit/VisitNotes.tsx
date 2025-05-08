
import { Visit } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface VisitNotesProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  initialShowNotes?: boolean;
}

export function VisitNotes({ visit, onVisitChange, initialShowNotes = false }: VisitNotesProps) {
  // Initialize showNotes based on whether we have existing notes
  const [showNotes, setShowNotes] = useState(initialShowNotes || !!visit.notes);
  // State to track the notes value directly without relying on the visit prop for rendering
  const [notesValue, setNotesValue] = useState(visit.notes || "");

  // Update local state when visit.notes changes externally
  useEffect(() => {
    if (visit.notes !== notesValue) {
      setNotesValue(visit.notes || "");
    }
    
    if (visit.notes && !showNotes) {
      setShowNotes(true);
    }
  }, [visit.notes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Update local state immediately to keep cursor position
    setNotesValue(newValue);
    
    // Then update parent component state
    onVisitChange({ 
      ...visit, 
      notes: newValue.trim() === '' ? undefined : newValue 
    });
  };

  // Prevent form submission when clicking the button
  const handleToggleNotes = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default button action
    setShowNotes(!showNotes);
  };

  // Handle click in the textarea to select all text
  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.currentTarget.select();
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
          value={notesValue} // Use the local state value
          onChange={handleNotesChange}
          onClick={handleTextareaClick}
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
