
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { formatStatus, getStatusVariant, calculateTotalFee } from "@/lib/utils/superbill-utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SuperbillCardProps } from "./types";
import { CardHeader } from "./CardHeader";
import { PatientInfo } from "./PatientInfo";
import { CardStats } from "./CardStats";
import { CardActions } from "./CardActions";
import { Checkbox } from "@/components/ui/checkbox";

export function SuperbillCard({ 
  superbill, 
  onDelete, 
  onClick,
  onSelectPatient,
  isPatientSelected,
  onStatusChange
}: SuperbillCardProps) {
  const totalFee = calculateTotalFee(superbill.visits);
  const visitCount = superbill.visits.length;
  
  // Get earliest and latest visit dates if visits exist
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  // Get all complaints from all visits
  const allComplaints: string[] = [];
  superbill.visits.forEach(visit => {
    if (visit.mainComplaints && visit.mainComplaints.length > 0) {
      visit.mainComplaints.forEach(complaint => {
        if (!allComplaints.includes(complaint)) {
          allComplaints.push(complaint);
        }
      });
    }
  });
  
  // Format status for display and get status variant
  const displayStatus = formatStatus(superbill.status);
  const statusVariant = getStatusVariant(superbill.status);
  
  // Handle checkbox change - call onSelectPatient with the appropriate parameters
  const handleCheckboxChange = (checked: boolean) => {
    if (onSelectPatient) {
      onSelectPatient(superbill.id, superbill.patientName, superbill.patientDob, checked);
    }
  };
  
  // Handle status change
  const handleStatusChange = (newStatus: SuperbillStatus) => {
    if (onStatusChange) {
      onStatusChange(superbill.id, newStatus);
    }
  };
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} relative`} 
      onClick={onClick ? onClick : undefined}
    >
      {onSelectPatient && (
        <div className="absolute top-6 left-2 z-10">
          <Checkbox 
            checked={isPatientSelected}
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="bg-white"
          />
        </div>
      )}
      
      <CardContent className={`pt-6 ${onSelectPatient ? 'pl-8' : ''}`}>
        <CardHeader 
          patientName={superbill.patientName}
          issueDate={superbill.issueDate}
          status={superbill.status}
          statusVariant={statusVariant}
          onStatusChange={onStatusChange ? handleStatusChange : undefined}
        />
        
        <PatientInfo 
          patientDob={superbill.patientDob}
          visitDates={{ earliestDate, latestDate }}
          complaints={allComplaints}
        />
        
        <CardStats 
          visitCount={visitCount}
          totalFee={totalFee}
        />
      </CardContent>
      
      <CardFooter>
        <CardActions 
          superbillId={superbill.id}
          onDelete={onDelete}
        />
      </CardFooter>
    </Card>
  );
}
