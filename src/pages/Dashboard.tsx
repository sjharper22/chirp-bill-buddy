
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentSuperbills } from "@/components/dashboard/RecentSuperbills";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  const navigate = useNavigate();
  const { superbills, deleteSuperbill } = useSuperbill();
  const { patients } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter superbills based on search term
  const filteredSuperbills = superbills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6); // Show only the most recent 6 superbills
  
  // Calculate total visits across all superbills
  const totalVisits = superbills.reduce((total, bill) => total + bill.visits.length, 0);
  
  // Calculate total billed amount
  const totalBilled = superbills.reduce((total, bill) => {
    return total + bill.visits.reduce((visitTotal, visit) => visitTotal + visit.fee, 0);
  }, 0);
  
  // Calculate average fee per visit
  const averageFee = totalVisits > 0 ? totalBilled / totalVisits : 0;
  
  const handleDeleteSuperbill = (id: string) => {
    deleteSuperbill(id);
    toast({
      title: "Superbill deleted",
      description: "The superbill has been deleted successfully.",
    });
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your superbills and patient statistics
          </p>
        </div>
        
        <Button onClick={() => navigate("/new")} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          New Superbill
        </Button>
      </div>
      
      <DashboardStats 
        totalPatients={patients.length}
        totalVisits={totalVisits}
        totalBilled={totalBilled}
        averageFee={averageFee}
      />
      
      <RecentSuperbills 
        filteredSuperbills={filteredSuperbills}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onDelete={handleDeleteSuperbill}
        totalSuperbills={superbills.length}
      />
      
      <QuickActions />
    </div>
  );
}
