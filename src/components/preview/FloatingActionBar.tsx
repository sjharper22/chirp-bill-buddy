
import { PrintButton } from "./buttons/PrintButton";
import { DownloadButton } from "./buttons/DownloadButton";
import { CopyButton } from "./buttons/CopyButton";
import { EmailButton } from "./buttons/EmailButton";
import { Superbill } from "@/types/superbill";

interface FloatingActionBarProps {
  superbill: Superbill;
  coverLetterContent?: string;
}

export function FloatingActionBar({ superbill, coverLetterContent }: FloatingActionBarProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-2 print:hidden">
      <PrintButton superbill={superbill} coverLetterContent={coverLetterContent} />
      <DownloadButton superbill={superbill} coverLetterContent={coverLetterContent} />
      <CopyButton superbill={superbill} />
      <EmailButton superbill={superbill} />
    </div>
  );
}
