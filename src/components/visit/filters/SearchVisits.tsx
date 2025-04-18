
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchVisitsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SearchVisits({ searchTerm, onSearchChange }: SearchVisitsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Search</label>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search visits..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}
