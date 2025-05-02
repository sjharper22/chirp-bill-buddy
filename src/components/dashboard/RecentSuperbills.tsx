
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Search, Plus, UserPlus, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";
import { toast } from "@/components/ui/use-toast";
import { SuperbillFilters } from "./filters/SuperbillFilters";
import { filterSuperbills, sortSuperbillsByDate } from "@/lib/utils/superbill-filter-utils";

interface RecentSuperbillsProps {
  filteredSuperbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  totalSuperbills: number;
  onSelectPatient?: (id: string, name: string, dob: Date, selected: boolean) => void;
  selectedPatientIds?: string[];
  selectionMode?: boolean;
  toggleSelectionMode?: () => void;
  onAddSelectedToPatients?: () => void;
}

export function RecentSuperbills({
  filteredSuperbills,
  searchTerm,
  onSearchChange,
  onDelete,
  totalSuperbills,
  onSelectPatient,
  selectedPatientIds = [],
  selectionMode = false,
  toggleSelectionMode,
  onAddSelectedToPatients
}: RecentSuperbillsProps) {
  const navigate = useNavigate();
  const [expandSearch, setExpandSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SuperbillStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Apply additional filtering based on status
  const displaySuperbills = filteredSuperbills
    .filter(bill => statusFilter === "all" ? true : bill.status === statusFilter)
    .sort((a, b) => {
      const dateA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
      const dateB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    })
    .slice(0, 6); // Show only the most recent 6 superbills based on filters
  
  return (
    <div className="mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Superbills</h2>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className={`relative transition-all ${expandSearch ? 'w-full sm:w-64' : 'w-10'}`}>
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer z-10" 
              onClick={() => setExpandSearch(true)}
            />
            <Input
              placeholder="Search superbills..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setExpandSearch(true)}
              onBlur={() => searchTerm === '' && setExpandSearch(false)}
              className={`transition-all pl-10 ${expandSearch ? 'opacity-100 w-full' : 'opacity-0 w-0 p-0 -ml-10 sm:ml-0'}`}
            />
          </div>
          
          <SuperbillFilters 
            onStatusFilter={setStatusFilter}
            onSortChange={setSortOrder}
            currentStatus={statusFilter}
            currentSort={sortOrder}
          />
          
          {toggleSelectionMode && (
            <Button 
              onClick={toggleSelectionMode} 
              variant={selectionMode ? "secondary" : "outline"}
              className="whitespace-nowrap"
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              {selectionMode ? "Cancel Selection" : "Select Patients"}
            </Button>
          )}

          {selectionMode && selectedPatientIds.length > 0 && onAddSelectedToPatients && (
            <Button onClick={onAddSelectedToPatients} className="whitespace-nowrap">
              <UserPlus className="mr-2 h-4 w-4" />
              Add {selectedPatientIds.length} to Patients
            </Button>
          )}
          
          {!selectionMode && (
            <Button onClick={() => navigate("/new")} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              New Superbill
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySuperbills.length > 0 ? (
          displaySuperbills.map(superbill => (
            <SuperbillCard
              key={superbill.id}
              superbill={superbill}
              onDelete={onDelete}
              onClick={!selectionMode ? () => navigate(`/view/${superbill.id}`) : undefined}
              onSelectPatient={selectionMode ? onSelectPatient : undefined}
              isPatientSelected={selectedPatientIds.includes(superbill.id)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 border rounded-lg bg-white">
            <p className="text-xl font-medium text-gray-500 mb-2">No superbills found</p>
            {statusFilter !== "all" ? (
              <p className="text-gray-400 mb-6">No superbills with status: {statusFilter}</p>
            ) : (
              <p className="text-gray-400 mb-6">Let's create your first superbill</p>
            )}
            <Button onClick={() => navigate("/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Superbill
            </Button>
          </div>
        )}
      </div>
      
      {displaySuperbills.length > 0 && totalSuperbills > displaySuperbills.length && !selectionMode && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/grouped-submission")}
            className="mx-auto"
          >
            View All Superbills
          </Button>
        </div>
      )}
    </div>
  );
}
