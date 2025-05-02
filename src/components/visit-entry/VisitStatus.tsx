
import { Visit } from "@/types/superbill";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";

interface VisitStatusProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function VisitStatus({ visit, onVisitChange }: VisitStatusProps) {
  const toggleStatus = () => {
    // Cycle through statuses: draft -> in_progress -> completed -> draft
    const currentStatus = visit.status || 'draft';
    let newStatus: 'draft' | 'in_progress' | 'completed';
    
    switch (currentStatus) {
      case 'draft':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'completed';
        break;
      case 'completed':
      default:
        newStatus = 'draft';
        break;
    }
    
    onVisitChange({ 
      ...visit, 
      status: newStatus
    });
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'draft':
      default: return 'info';
    }
  };

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        toggleStatus();
      }}
      className="cursor-pointer"
      title="Click to change status"
    >
      <StatusBadge 
        status={visit.status || 'draft'} 
        variant={getStatusVariant(visit.status)}
        className="mr-2"
      />
    </div>
  );
}
