
import { Superbill } from "@/types/superbill";
import { PrintButton } from "./buttons/PrintButton";
import { DownloadButton } from "./buttons/DownloadButton";
import { CopyButton } from "./buttons/CopyButton";
import { EmailButton } from "./buttons/EmailButton";

interface ActionButtonsProps {
  superbill: Superbill;
}

export function ActionButtons({ superbill }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2 mt-4">
      <PrintButton superbill={superbill} />
      <DownloadButton superbill={superbill} />
      <CopyButton superbill={superbill} />
      <EmailButton superbill={superbill} />
    </div>
  );
}
