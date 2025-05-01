
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PatientSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PatientSearch({ searchQuery, onSearchChange }: PatientSearchProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search patients..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
