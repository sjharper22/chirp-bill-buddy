
import { CoverSheet } from "@/components/cover-sheet/CoverSheet";
import { CoverLetterPreview } from "@/components/cover-letter/CoverLetterPreview";
import { Superbill } from "@/types/superbill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface GroupPreviewProps {
  showCoverSheet: boolean;
  showCoverLetter: boolean;
  selectedSuperbills: Superbill[];
}

export function GroupPreview({ showCoverSheet, showCoverLetter, selectedSuperbills }: GroupPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("coverSheet");
  
  if ((!showCoverSheet && !showCoverLetter) || selectedSuperbills.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <Tabs defaultValue={showCoverSheet ? "coverSheet" : "coverLetter"} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          
          <TabsList>
            {showCoverSheet && (
              <TabsTrigger value="coverSheet">Cover Sheet</TabsTrigger>
            )}
            {showCoverLetter && (
              <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
            )}
          </TabsList>
        </div>
        
        {showCoverSheet && (
          <TabsContent value="coverSheet">
            <CoverSheet superbills={selectedSuperbills} />
          </TabsContent>
        )}
        
        {showCoverLetter && (
          <TabsContent value="coverLetter">
            <CoverLetterPreview superbills={selectedSuperbills} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
