
import { Visit } from "@/types/superbill";
import { VisitDatePicker } from "@/components/visit/VisitDatePicker";
import { VisitComplaints } from "@/components/visit/VisitComplaints";
import { IcdCodeSelector } from "@/components/visit/IcdCodeSelector";
import { CptCodeTableSelector } from "@/components/visit/CptCodeTableSelector";
import { VisitNotes } from "@/components/visit/VisitNotes";
import { VisitSection as VisitSectionType } from "@/hooks/useVisitSections";

interface VisitSectionContentProps {
  section: VisitSectionType;
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  defaultMainComplaints?: string[];
}

export function VisitSectionContent({ 
  section, 
  visit, 
  onVisitChange,
  defaultMainComplaints = [] 
}: VisitSectionContentProps) {
  switch (section) {
    case 'date':
      return (
        <div className="w-full sm:w-auto">
          <VisitDatePicker visit={visit} onVisitChange={onVisitChange} />
        </div>
      );
    case 'complaints':
      return (
        <div className="w-full sm:flex-1">
          <VisitComplaints 
            visit={visit} 
            onVisitChange={onVisitChange} 
            defaultMainComplaints={defaultMainComplaints} 
          />
        </div>
      );
    case 'codes':
      return (
        <div className="w-full space-y-4">
          <IcdCodeSelector visit={visit} onVisitChange={onVisitChange} />
          <CptCodeTableSelector visit={visit} onVisitChange={onVisitChange} />
        </div>
      );
    case 'fee':
      return null; // Fee input moved to CPT codes section
    case 'notes':
      return (
        <div className="w-full">
          <VisitNotes visit={visit} onVisitChange={onVisitChange} />
        </div>
      );
    default:
      return null;
  }
}
