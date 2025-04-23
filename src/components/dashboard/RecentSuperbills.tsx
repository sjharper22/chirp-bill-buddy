
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuperbillCard } from "@/components/SuperbillCard";
import { Superbill } from "@/types/superbill";
import { useNavigate } from "react-router-dom";

interface RecentSuperbillsProps {
  filteredSuperbills: Superbill[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: string) => void;
  totalSuperbills: number;
}

export function RecentSuperbills({ 
  filteredSuperbills, 
  searchTerm, 
  onSearchChange,
  onDelete,
  totalSuperbills 
}: RecentSuperbillsProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Superbills</h2>
        <div className="max-w-xs relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuperbills.length > 0 ? (
          filteredSuperbills.map(superbill => (
            <SuperbillCard
              key={superbill.id}
              superbill={superbill}
              onDelete={onDelete}
              onClick={() => navigate(`/view/${superbill.id}`)}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white border rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No superbills found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Create your first superbill to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate("/new")} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Superbill
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {filteredSuperbills.length > 0 && totalSuperbills > 6 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => navigate("/superbills")}>
            View All Superbills
          </Button>
        </div>
      )}
    </div>
  );
}
