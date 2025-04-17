
import { useParams, useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { SuperbillPreview } from "@/components/SuperbillPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils/superbill-utils";

export default function ViewSuperbill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSuperbill } = useSuperbill();
  
  const superbill = id ? getSuperbill(id) : undefined;
  
  if (!superbill) {
    return (
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium mb-2">Superbill not found</p>
          <p className="text-muted-foreground mb-6">
            The superbill you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Get earliest and latest visit dates if visits exist
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">{superbill.patientName}</h1>
            <p className="text-muted-foreground">
              Issued on {formatDate(superbill.issueDate)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <SuperbillPreview superbill={superbill} />
          
          <Button onClick={() => navigate(`/edit/${superbill.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Superbill
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
            <div className="space-y-1">
              <p><span className="font-medium">Name:</span> {superbill.patientName}</p>
              <p><span className="font-medium">DOB:</span> {formatDate(superbill.patientDob)}</p>
              {visitDates.length > 0 && (
                <p>
                  <span className="font-medium">Visit Period:</span> {formatDate(earliestDate)} to {formatDate(latestDate)}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Provider Information</h3>
            <div className="space-y-1">
              <p><span className="font-medium">Provider:</span> {superbill.providerName}</p>
              <p>{superbill.clinicName}</p>
              <p>{superbill.clinicAddress}</p>
              <p><span className="font-medium">Phone:</span> {superbill.clinicPhone}</p>
              <p><span className="font-medium">Email:</span> {superbill.clinicEmail}</p>
              <p><span className="font-medium">EIN:</span> {superbill.ein}</p>
              <p><span className="font-medium">NPI #:</span> {superbill.npi}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Visits ({superbill.visits.length})</h3>
          
          {superbill.visits.length === 0 ? (
            <p className="text-muted-foreground italic">No visits added to this superbill.</p>
          ) : (
            <div className="space-y-4">
              {superbill.visits.map((visit, index) => (
                <div key={visit.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="font-medium">Visit Date: {formatDate(visit.date)}</p>
                      
                      {visit.mainComplaints && visit.mainComplaints.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Main Complaints:</p>
                          <p className="text-sm">{visit.mainComplaints.join(', ')}</p>
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <p className="text-sm font-medium">ICD-10 Codes:</p>
                        <p className="text-sm">
                          {visit.icdCodes.length > 0 
                            ? visit.icdCodes.join(", ") 
                            : <span className="text-muted-foreground italic">None</span>}
                        </p>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm font-medium">CPT Codes:</p>
                        <p className="text-sm">
                          {visit.cptCodes.length > 0 
                            ? visit.cptCodes.join(", ") 
                            : <span className="text-muted-foreground italic">None</span>}
                        </p>
                      </div>
                      
                      {visit.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Notes:</p>
                          <p className="text-sm">{visit.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Fee</p>
                      <p className="font-bold">${visit.fee.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
