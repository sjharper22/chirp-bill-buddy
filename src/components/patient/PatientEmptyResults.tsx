
import { ClipboardList } from "lucide-react";

interface PatientEmptyResultsProps {
  searchTerm: string;
}

export function PatientEmptyResults({ searchTerm }: PatientEmptyResultsProps) {
  return (
    <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
      <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
      <p className="text-lg font-medium mt-4 mb-2">No patients found</p>
      <p className="text-muted-foreground">
        {searchTerm ? "Try adjusting your search terms" : "Add your first patient to get started"}
      </p>
    </div>
  );
}
