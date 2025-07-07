import { useState, useEffect } from "react";
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Superbill } from "@/types/superbill";
import { useSuperbill } from "@/context/superbill-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/superbill-utils";
import { ActionButtons } from "@/components/superbill/ActionButtons";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, Calendar, DollarSign, Copy, Merge, CalendarRange } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PatientSuperbillsSectionProps {
  patient: PatientProfileType;
}

export function PatientSuperbillsSection({ patient }: PatientSuperbillsSectionProps) {
  const { superbills, duplicateSuperbill } = useSuperbill();
  const [patientSuperbills, setPatientSuperbills] = useState<Superbill[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Filter superbills for this patient
    const filtered = superbills.filter(
      superbill => superbill.patientName.toLowerCase() === patient.name.toLowerCase()
    );
    setPatientSuperbills(filtered);
  }, [superbills, patient.name]);

  const handleDuplicate = (superbillId: string, patientName: string) => {
    try {
      const newId = duplicateSuperbill(superbillId);
      
      toast({
        title: "Superbill duplicated",
        description: `Created a copy of ${patientName}'s superbill`,
      });
      
      // Navigate to edit the new duplicated superbill
      navigate(`/edit/${newId}`);
    } catch (error) {
      console.error("Error duplicating superbill:", error);
      toast({
        title: "Error duplicating superbill",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    }
  };

  const totalBilled = patientSuperbills.reduce((sum, superbill) => {
    return sum + superbill.visits.reduce((visitSum, visit) => visitSum + (visit.fee || 0), 0);
  }, 0);

  const totalVisits = patientSuperbills.reduce((sum, superbill) => {
    return sum + superbill.visits.length;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Superbills</h3>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/advanced-superbill?tab=daterange" state={{ prefilledPatient: patient }}>
              <CalendarRange className="mr-2 h-4 w-4" />
              From Date Range
            </Link>
          </Button>
          {patientSuperbills.length >= 2 && (
            <Button asChild size="sm" variant="outline">
              <Link to="/advanced-superbill?tab=merge" state={{ prefilledPatient: patient }}>
                <Merge className="mr-2 h-4 w-4" />
                Merge Superbills
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/new-superbill" state={{ prefilledPatient: patient }}>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Superbills</p>
                <p className="text-2xl font-bold">{patientSuperbills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold">{totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold">${totalBilled.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Superbills List */}
      {patientSuperbills.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No superbills found</h4>
            <p className="text-muted-foreground mb-4">
              Create a new superbill for {patient.name} to get started.
            </p>
            <Button asChild>
              <Link to="/new-superbill" state={{ prefilledPatient: patient }}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Superbill
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {patientSuperbills.map((superbill) => (
            <Card key={superbill.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Superbill - {formatDate(superbill.issueDate)}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={superbill.status === 'draft' ? 'secondary' : 'default'}>
                        {superbill.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {superbill.visits.length} visit{superbill.visits.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDuplicate(superbill.id, patient.name)}
                    >
                      <Copy className="mr-1 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/view/${superbill.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/edit/${superbill.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {superbill.visits.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Visit Dates:</p>
                      <div className="flex flex-wrap gap-1">
                        {superbill.visits.slice(0, 3).map((visit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {formatDate(visit.date)}
                          </Badge>
                        ))}
                        {superbill.visits.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{superbill.visits.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <ActionButtons superbill={superbill} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
