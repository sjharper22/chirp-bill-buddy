
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuperbillCard } from "@/components/SuperbillCard";
import { filterSuperbills, sortSuperbillsByDate } from "@/lib/utils/superbill-utils";
import { Plus, ClipboardList, User } from "lucide-react";
import { PracticeLogo } from "@/components/PracticeLogo";

export default function Dashboard() {
  const navigate = useNavigate();
  const { superbills } = useSuperbill();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSuperbills = filterSuperbills(superbills, searchTerm);
  const sortedSuperbills = sortSuperbillsByDate(filteredSuperbills);
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <PracticeLogo />
          <div>
            <h1 className="text-3xl font-bold">Superbill Dashboard</h1>
            <p className="text-muted-foreground">
              Create, manage, and track superbills for your patients
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => navigate("/patients")} className="flex-shrink-0">
            <User className="mr-2 h-4 w-4" />
            Patient Profiles
          </Button>
          <Button onClick={() => navigate("/new")} className="flex-shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            New Superbill
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search by patient name or date..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      
      {sortedSuperbills.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          {searchTerm ? (
            <>
              <p className="text-lg font-medium mb-2">No matching superbills</p>
              <p className="text-muted-foreground mb-6">
                Try a different search term or clear your search
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-lg font-medium mt-4 mb-2">No superbills created yet</p>
              <p className="text-muted-foreground mb-6">
                Create your first superbill to get started
              </p>
              <Button onClick={() => navigate("/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Superbill
              </Button>
            </>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSuperbills.map(superbill => (
          <SuperbillCard
            key={superbill.id}
            superbill={superbill}
            onClick={() => navigate(`/view/${superbill.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
