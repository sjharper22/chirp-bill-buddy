
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";

interface PatientEmptyStateProps {
  canEdit: boolean;
  isSearching: boolean;
  onAddClick: () => void;
  onClearSearch: () => void;
}

export function PatientEmptyState({ canEdit, isSearching, onAddClick, onClearSearch }: PatientEmptyStateProps) {
  if (isSearching) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <p className="text-lg font-medium mb-2">No matching patients</p>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search criteria
        </p>
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      </div>
    );
  }
  
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <User className="h-12 w-12 mx-auto text-muted-foreground" />
      <p className="text-lg font-medium mt-4 mb-2">No patients added yet</p>
      <p className="text-muted-foreground mb-6">
        Add patient profiles to streamline your superbill creation process
      </p>
      {canEdit && (
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Patient
        </Button>
      )}
    </div>
  );
}
