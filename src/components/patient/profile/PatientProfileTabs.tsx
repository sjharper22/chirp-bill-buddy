
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientViewMode } from "./PatientViewMode";
import { PatientSuperbillsSection } from "./PatientSuperbillsSection";
import { VisitManagement } from "@/components/visits/VisitManagement";
import { User, FileText, Calendar, Edit } from "lucide-react";

interface PatientProfileTabsProps {
  patient: PatientProfileType;
  onEdit: () => void;
}

export function PatientProfileTabs({ patient, onEdit }: PatientProfileTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="visits" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Visits
        </TabsTrigger>
        <TabsTrigger value="superbills" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Superbills
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <PatientViewMode patient={patient} onEdit={onEdit} />
      </TabsContent>
      
      <TabsContent value="visits" className="mt-6">
        <VisitManagement patient={patient} />
      </TabsContent>
      
      <TabsContent value="superbills" className="mt-6">
        <PatientSuperbillsSection patient={patient} />
      </TabsContent>
    </Tabs>
  );
}
