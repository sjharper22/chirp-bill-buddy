
import { Loader2 } from "lucide-react";

export function PatientLoading() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
