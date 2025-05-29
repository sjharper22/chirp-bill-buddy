
import { PrintButton } from "./buttons/PrintButton";
import { DownloadButton } from "./buttons/DownloadButton";
import { CopyButton } from "./buttons/CopyButton";
import { EmailButton } from "./buttons/EmailButton";
import { Superbill } from "@/types/superbill";

interface ActionButtonsProps {
  superbill: Superbill;
  coverLetterContent?: string;
}

export function ActionButtons({ superbill, coverLetterContent }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <PrintButton superbill={superbill} coverLetterContent={coverLetterContent} />
      <DownloadButton superbill={superbill} coverLetterContent={coverLetterContent} />
      <CopyButton superbill={superbill} />
      <EmailButton superbill={superbill} />
    </div>
  );
}
