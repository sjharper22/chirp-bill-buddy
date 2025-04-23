
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuperbillCard } from "@/components/SuperbillCard";
import { filterSuperbills, sortSuperbillsByDate } from "@/lib/utils/superbill-utils";
import { Plus, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { superbills, deleteSuperbill } = useSuperbill();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSuperbills = filterSuperbills(superbills, searchTerm);
  const sortedSuperbills = sortSuperbillsByDate(filteredSuperbills);
  
  const handleDeleteSuperbill = (id: string) => {
    deleteSuperbill(id);
    toast({
      title: "Superbill deleted",
      description: "The superbill has been deleted successfully.",
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            View and manage your superbills
          </p>
        </div>
        
        <Button onClick={() => navigate("/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Superbill
        </Button>
      </div>
      
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search superbills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSuperbills.map(superbill => (
          <SuperbillCard
            key={superbill.id}
            superbill={superbill}
            onDelete={handleDeleteSuperbill}
            onClick={() => navigate(`/view/${superbill.id}`)}
          />
        ))}
      </div>

      {sortedSuperbills.length === 0 && (
        <div className="text-center py-16 bg-white border rounded-lg shadow-sm">
          <div className="max-w-md mx-auto">
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
  );
}
