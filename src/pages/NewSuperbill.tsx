
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SuperbillForm } from "@/components/SuperbillForm";
import { PatientProfile } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewSuperbill() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledPatient = location.state?.prefilledPatient as PatientProfile | undefined;
  const [showVisitSelection, setShowVisitSelection] = useState(false);

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>

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
