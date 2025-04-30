
import { Superbill } from "@/types/superbill";
import { InfoSection } from "./InfoSection";
import { ServicesTable } from "./ServicesTable";
import { NotesPreview } from "./NotesPreview";
import { Footer } from "./Footer";
import { VisitSummary } from "@/components/summary/VisitSummary";
import { CoverLetterPreview } from "@/components/cover-letter/CoverLetterPreview";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreviewProps {
  superbill: Superbill;
  selectedTemplateId?: string;
}

export function Preview({ superbill, selectedTemplateId }: PreviewProps) {
  const [showCoverLetter, setShowCoverLetter] = useState(true);
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  return (
    <div className="mt-4 p-6 border rounded-lg superbill-preview-content">
      <div className="mb-4 flex justify-end">
        <div className="flex items-center space-x-2">
          <Switch
            id="cover-letter"
            checked={showCoverLetter}
            onCheckedChange={setShowCoverLetter}
          />
          <Label htmlFor="cover-letter">Show Cover Letter</Label>
        </div>
      </div>
      
      {showCoverLetter && (
        <CoverLetterPreview 
          superbill={superbill} 
          selectedTemplateId={selectedTemplateId} 
        />
      )}
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">SUPERBILL</h2>
      </div>
      
      <InfoSection 
        superbill={superbill}
        earliestDate={earliestDate}
        latestDate={latestDate}
      />
      
      {superbill.visits.length > 0 && (
        <VisitSummary visits={superbill.visits} />
      )}
      
      <ServicesTable visits={superbill.visits} />
      
      <NotesPreview visits={superbill.visits} />
      
      <Footer />
    </div>
  );
}
