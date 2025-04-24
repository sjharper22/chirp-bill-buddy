
import { CoverSheet } from "@/components/cover-sheet/CoverSheet";
import { Superbill } from "@/types/superbill";

interface GroupPreviewProps {
  showCoverSheet: boolean;
  selectedSuperbills: Superbill[];
}

export function GroupPreview({ showCoverSheet, selectedSuperbills }: GroupPreviewProps) {
  if (!showCoverSheet || selectedSuperbills.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Cover Sheet Preview</h2>
      <CoverSheet superbills={selectedSuperbills} />
    </div>
  );
}
