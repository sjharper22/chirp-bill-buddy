
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Preview } from "@/components/preview/Preview";
import { Superbill } from "@/types/superbill";
import { PatientProfile } from "@/types/patient";

interface PreviewDialogProps {
  open: boolean;
  content: Superbill | PatientProfile | null;
  contentType: 'superbill' | 'patient';
  title?: string;
  onOpenChange: (open: boolean) => void;
}

export function PreviewDialog({ 
  open, 
  content, 
  contentType,
  title = "Preview",
  onOpenChange 
}: PreviewDialogProps) {
  if (!content) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {contentType === 'superbill' && (
          <Preview superbill={content as Superbill} showCoverLetter={true} />
        )}
        
        {contentType === 'patient' && (
          <div className="p-4">
            <h2 className="text-xl font-bold">{(content as PatientProfile).name}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p>{new Date((content as PatientProfile).dob).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Common ICD Codes</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(content as PatientProfile).commonIcdCodes?.map(code => (
                    <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Common CPT Codes</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(content as PatientProfile).commonCptCodes?.map(code => (
                    <div key={code} className="bg-muted px-2 py-1 rounded text-xs">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
              
              {(content as PatientProfile).notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-line">{(content as PatientProfile).notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
