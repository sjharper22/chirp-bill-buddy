
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GroupStats } from "./GroupStats";
import { PatientWithSuperbills } from "./types";

interface GroupHeaderProps {
  selectedPatients: PatientWithSuperbills[];
  onClearSelection: () => void;
  onNavigateBack: () => void;
}

export function GroupHeader({ selectedPatients, onClearSelection, onNavigateBack }: GroupHeaderProps) {
  return (
    <>
      <Button variant="outline" onClick={onNavigateBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Group Submissions</h1>
          <p className="text-muted-foreground">
            Manage and submit multiple superbills together
          </p>
        </div>
        
        <GroupStats 
          selectedPatients={selectedPatients}
          onClearSelection={onClearSelection}
        />
      </div>
    </>
  );
}
