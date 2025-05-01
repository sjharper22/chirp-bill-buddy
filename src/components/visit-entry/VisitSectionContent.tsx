
import { Visit } from "@/types/superbill";
import { VisitDatePicker } from "@/components/visit/VisitDatePicker";
import { VisitComplaints } from "@/components/visit/VisitComplaints";
import { IcdCodeSelector } from "@/components/visit/IcdCodeSelector";
import { CptCodeSelector } from "@/components/visit/CptCodeSelector";
import { VisitNotes } from "@/components/visit/VisitNotes";
import { VisitFeeInput } from "./VisitFeeInput";
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
        <div className="w-full">
          <IcdCodeSelector visit={visit} onVisitChange={onVisitChange} />
          <CptCodeSelector visit={visit} onVisitChange={onVisitChange} />
        </div>
      );
    case 'fee':
      return <VisitFeeInput visit={visit} onChange={onVisitChange} />;
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
