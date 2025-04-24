
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Preview } from "@/components/preview/Preview";
import { Superbill } from "@/types/superbill";

interface PreviewDialogProps {
  open: boolean;
  superbill: Superbill | null;
  onOpenChange: (open: boolean) => void;
}

export function PreviewDialog({ open, superbill, onOpenChange }: PreviewDialogProps) {
  if (!superbill) return null;
  
  return (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Superbill Preview</DialogTitle>
      </DialogHeader>
      <Preview superbill={superbill} />
    </DialogContent>
  );
}
