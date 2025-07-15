
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
      return (
        <div className="w-full space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Visit Total</div>
            <input
              type="number"
              placeholder="Enter total visit amount"
              value={visit.fee || ""}
              onChange={(e) => {
                const totalAmount = parseFloat(e.target.value) || 0;
                const cptEntries = visit.cptCodeEntries || [];
                const entryCount = cptEntries.length;
                
                if (entryCount > 0) {
                  const feePerCode = totalAmount / entryCount;
                  const updatedEntries = cptEntries.map(entry => ({
                    ...entry,
                    fee: feePerCode
                  }));
                  onVisitChange({
                    ...visit,
                    fee: totalAmount,
                    cptCodeEntries: updatedEntries
                  });
                } else {
                  onVisitChange({
                    ...visit,
                    fee: totalAmount
                  });
                }
              }}
              className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md text-lg font-semibold"
              min={0}
              step={0.01}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {visit.cptCodeEntries?.length > 0 
                ? `Divided equally among ${visit.cptCodeEntries.length} CPT code${visit.cptCodeEntries.length > 1 ? 's' : ''}`
                : 'Add CPT codes to divide amount automatically'
              }
            </div>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Calculated Total</div>
            <div className="text-lg font-semibold">
              ${(visit.cptCodeEntries?.reduce((sum, entry) => sum + entry.fee, 0) || 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on individual CPT code fees
            </div>
          </div>
        </div>
      );
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
