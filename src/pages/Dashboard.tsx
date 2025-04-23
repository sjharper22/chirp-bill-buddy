
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { usePatient } from "@/context/patient-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SuperbillCard } from "@/components/SuperbillCard";
import { DollarSign, Users, FileText, Calendar, Plus, Search, Activity, ClipboardList, LayoutTemplate } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils/superbill-utils";

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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <p className="text-3xl font-bold">{patients.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
              <p className="text-3xl font-bold">{totalVisits}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Billed</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBilled)}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Fee</p>
              <p className="text-3xl font-bold">{formatCurrency(averageFee)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Superbills */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Superbills</h2>
          <div className="max-w-xs relative">
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
          {filteredSuperbills.length > 0 ? (
            filteredSuperbills.map(superbill => (
              <SuperbillCard
                key={superbill.id}
                superbill={superbill}
                onDelete={handleDeleteSuperbill}
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
        
        {filteredSuperbills.length > 0 && superbills.length > 6 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => navigate("/superbills")}>
              View All Superbills
            </Button>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Add and manage your patient profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate("/patients")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Patients
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Create and manage your code templates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate("/templates")}>
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Manage Templates
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>Create grouped submissions for insurance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate("/grouped-submission")}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Group Submissions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
