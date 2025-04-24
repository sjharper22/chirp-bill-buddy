
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GroupFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}

export function GroupFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}: GroupFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search patients..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterStatus(null)}
            className={`mr-2 ${!filterStatus ? 'bg-muted' : ''}`}
          >
            <Filter className="mr-2 h-4 w-4" />
            All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterStatus("Complete")}
            className={filterStatus === "Complete" ? 'bg-muted' : ''}
          >
            Complete
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterStatus("Missing Info")}
            className={filterStatus === "Missing Info" ? 'bg-muted' : ''}
          >
            Missing Info
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterStatus("Draft")}
            className={filterStatus === "Draft" ? 'bg-muted' : ''}
          >
            Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
