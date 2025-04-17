
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { SuperbillCard } from "@/components/SuperbillCard";
import { ClinicInfoDisplay } from "@/components/ClinicInfoDisplay";
import { filterSuperbills, sortSuperbillsByDate } from "@/lib/utils/superbill-utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { superbills, deleteSuperbill } = useSuperbill();
  const [searchTerm, setSearchTerm] = useState("");
  const [superbillToDelete, setSuperbillToDelete] = useState<string | null>(null);
  
  // Filter and sort superbills
  const filteredSuperbills = filterSuperbills(superbills, searchTerm);
  const sortedSuperbills = sortSuperbillsByDate(filteredSuperbills);
  
  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setSuperbillToDelete(id);
  };
  
  const handleDelete = () => {
    if (superbillToDelete) {
      deleteSuperbill(superbillToDelete);
      setSuperbillToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setSuperbillToDelete(null);
  };
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Superbill Generator</h1>
            <p className="text-muted-foreground">Collective Family Chiropractic</p>
          </div>
          
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            
            <Button asChild>
              <Link to="/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Superbill
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by patient name or date..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </header>
      
      <main>
        {sortedSuperbills.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            {searchTerm ? (
              <div>
                <p className="text-lg font-medium mb-2">No matching superbills found</p>
                <p className="text-muted-foreground">
                  Try a different search term or clear the search
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">No superbills created yet</p>
                <p className="text-muted-foreground mb-4">
                  Create your first superbill to get started
                </p>
                
                <div className="mb-6 mt-6">
                  <ClinicInfoDisplay />
                </div>
                
                <Button asChild>
                  <Link to="/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Superbill
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSuperbills.map(superbill => (
              <SuperbillCard
                key={superbill.id}
                superbill={superbill}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!superbillToDelete} onOpenChange={open => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected superbill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
