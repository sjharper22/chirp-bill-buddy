
import { Superbill } from "@/types/superbill";
import { InfoSection } from "./InfoSection";
import { ServicesTable } from "./ServicesTable";
import { NotesPreview } from "./NotesPreview";
import { Footer } from "./Footer";
import { VisitSummary } from "@/components/summary/VisitSummary";
import { CoverLetterPreview } from "@/components/cover-letter/CoverLetterPreview";
import { ActionButtons } from "./ActionButtons";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreviewProps {
  superbill: Superbill;
  selectedTemplateId?: string;
  showCoverLetter?: boolean;
  coverLetterContent?: string;
}

export function Preview({ 
  superbill, 
  selectedTemplateId, 
  showCoverLetter = true,
  coverLetterContent
}: PreviewProps) {
  const [displayCoverLetter, setDisplayCoverLetter] = useState(showCoverLetter);
  const visitDates = superbill.visits.map(visit => new Date(visit.date).getTime());
  const earliestDate = visitDates.length > 0 ? new Date(Math.min(...visitDates)) : null;
  const latestDate = visitDates.length > 0 ? new Date(Math.max(...visitDates)) : null;
  
  // Reset displayCoverLetter when showCoverLetter prop changes
  useEffect(() => {
    setDisplayCoverLetter(showCoverLetter);
  }, [showCoverLetter]);
  
  console.log("Preview render:", { 
    showCoverLetter, 
    displayCoverLetter, 
    selectedTemplateId,
    hasContent: Boolean(coverLetterContent),
    contentLength: coverLetterContent?.length || 0,
    patientName: superbill.patientName
  });
  
  return (
    <div className="relative">
      {/* Top Action Bar - Always visible on screen */}
      <div className="mb-4 p-4 bg-gray-50 border rounded-lg print:hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="cover-letter-top"
              checked={displayCoverLetter}
              onCheckedChange={setDisplayCoverLetter}
            />
            <Label htmlFor="cover-letter-top">Show Cover Letter</Label>
          </div>
          <ActionButtons superbill={superbill} coverLetterContent={coverLetterContent} />
        </div>
      </div>

      <div className="p-6 border rounded-lg superbill-preview-content">
        <div className="mb-4 flex justify-end print:hidden">
          <div className="flex items-center space-x-2">
            <Switch
              id="cover-letter"
              checked={displayCoverLetter}
              onCheckedChange={setDisplayCoverLetter}
            />
            <Label htmlFor="cover-letter">Show Cover Letter</Label>
          </div>
        </div>
        
        {displayCoverLetter && (
          <div className="page-break-after">
            <CoverLetterPreview 
              superbills={[superbill]}
              selectedTemplateId={selectedTemplateId}
              content={coverLetterContent}
            />
          </div>
        )}
        
        <div className="no-page-break">
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
      </div>

      {/* Bottom Action Bar - Always visible on screen */}
      <div className="mt-4 p-4 bg-gray-50 border rounded-lg print:hidden">
        <div className="flex justify-center">
          <ActionButtons superbill={superbill} coverLetterContent={coverLetterContent} />
        </div>
      </div>
    </div>
  );
}
