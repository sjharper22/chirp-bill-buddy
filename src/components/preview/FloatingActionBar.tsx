
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
    <div 
      className="print:hidden"
      style={{ 
        position: 'fixed',
        zIndex: 10000,
        bottom: '24px',
        right: '24px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '8px',
        display: 'flex',
        gap: '8px'
      }}
    >
      <PrintButton superbill={superbill} coverLetterContent={coverLetterContent} />
      <DownloadButton superbill={superbill} coverLetterContent={coverLetterContent} />
      <CopyButton superbill={superbill} />
      <EmailButton superbill={superbill} />
    </div>
  );
}
