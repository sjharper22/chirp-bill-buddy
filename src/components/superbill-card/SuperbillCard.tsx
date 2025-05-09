
import { Superbill } from "@/types/superbill";
import { CardHeader } from "./CardHeader";
import { PatientInfo } from "./PatientInfo";
import { CardStats } from "./CardStats";
import { CardActions } from "./CardActions";
import { Card } from "@/components/ui/card";
import { SuperbillStatus } from "@/types/superbill";
import { getStatusVariant } from "@/lib/utils/visit-utils";
import { Checkbox } from "@/components/ui/checkbox";
import { SuperbillCardProps } from "./types";
import { useState, useEffect } from "react";

export function SuperbillCard({ 
  superbill, 
  onDelete, 
  onClick, 
  onSelectPatient, 
  isPatientSelected,
  onStatusChange,
  isCollapsed,
  isExpanded: controlledIsExpanded,
  onToggleExpand
}: SuperbillCardProps) {
  // Use internal state for expansion if not controlled externally
  const [isExpandedInternal, setIsExpandedInternal] = useState(false);
  
  // Determine if card is expanded - use controlled prop if provided, otherwise use internal state
  const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : isExpandedInternal;
  
  // Calculate total fee from all visits
  const totalFee = superbill.visits.reduce((sum, visit) => sum + (visit.fee || 0), 0);
  
  // Get visit count
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
  
  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Handle status change
  const handleStatusChange = (newStatus: SuperbillStatus) => {
    if (onStatusChange) {
      onStatusChange(superbill.id, newStatus);
    }
  };
  
  // Handle patient selection
  const handleSelectPatient = () => {
    if (onSelectPatient) {
      onSelectPatient(superbill.id);
    }
  };

  // Handle expand toggle
  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(superbill.id);
    } else {
      setIsExpandedInternal(!isExpandedInternal);
    }
  };

  // Get status variant and convert "error" to "danger" if needed for compatibility
  const statusVariant = getStatusVariant(superbill.status);
  const convertedStatusVariant = statusVariant === "error" ? "danger" : statusVariant;
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
    >
      <div className="p-4 space-y-4">
        {/* Selection checkbox */}
        {onSelectPatient && (
          <div className="flex justify-end">
            <Checkbox 
              checked={isPatientSelected} 
              onCheckedChange={handleSelectPatient}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        <CardHeader 
          patientName={superbill.patientName}
          issueDate={superbill.issueDate}
          status={formatStatus(superbill.status)}
          statusVariant={convertedStatusVariant}
          onStatusChange={onStatusChange ? handleStatusChange : undefined}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
        />
        
        <PatientInfo 
          patientDob={superbill.patientDob}
          visitDates={{ earliestDate, latestDate }}
          complaints={allComplaints}
          isExpanded={isExpanded}
        />
        
        <CardStats 
          visitCount={visitCount}
          totalFee={totalFee}
        />
      </div>
      
      <CardActions 
        superbillId={superbill.id} 
        onDelete={onDelete}
        isCollapsed={isCollapsed}
        isExpanded={isExpanded}
      />
    </Card>
  );
}
