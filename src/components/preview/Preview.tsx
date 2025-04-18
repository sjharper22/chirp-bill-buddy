
import { Superbill } from "@/types/superbill";
import { InfoSection } from "./InfoSection";
import { ServicesTable } from "./ServicesTable";
import { NotesPreview } from "./NotesPreview";
import { Footer } from "./Footer";

interface PreviewProps {
  superbill: Superbill;
}

export function Preview({ superbill }: PreviewProps) {
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return (
    <div className="mt-4 p-6 border rounded-lg superbill-preview-content">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">SUPERBILL</h2>
      </div>
      
      <InfoSection 
        superbill={superbill}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
      
      <ServicesTable visits={superbill.visits} />
      
      <NotesPreview visits={superbill.visits} />
      
      <Footer />
    </div>
  );
}
