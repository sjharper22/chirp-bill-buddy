
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CoverLetterEditor } from "@/components/cover-letter/CoverLetterEditor";
import { Superbill } from "@/types/superbill";

interface CoverLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSuperbills: Superbill[];
  content: string;
  onContentChange: (content: string) => void;
}

export function CoverLetterDialog({ 
  open, 
  onOpenChange, 
  selectedSuperbills, 
  content, 
  onContentChange 
}: CoverLetterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Cover Letter</DialogTitle>
        </DialogHeader>
        
        {selectedSuperbills.length > 0 && (
          <CoverLetterEditor
            superbill={selectedSuperbills[0]}
            content={content}
            onContentChange={onContentChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
