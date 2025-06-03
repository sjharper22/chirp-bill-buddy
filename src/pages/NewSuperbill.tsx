
import { useLocation } from "react-router-dom";
import { SuperbillForm } from "@/components/SuperbillForm";
import { PatientProfile } from "@/types/patient";

export default function NewSuperbill() {
  const location = useLocation();
  const prefilledPatient = location.state?.prefilledPatient as PatientProfile | undefined;

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Superbill</h1>
        {prefilledPatient && (
          <p className="text-muted-foreground mt-2">
            Creating superbill for {prefilledPatient.name}
          </p>
        )}
      </div>
      
      <SuperbillForm prefilledPatient={prefilledPatient} />
    </div>
  );
}
