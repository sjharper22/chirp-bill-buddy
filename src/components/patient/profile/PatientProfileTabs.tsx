
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientProfile as PatientProfileType } from "@/types/patient";
import { PatientViewMode } from "./PatientViewMode";
import { PatientSuperbillsSection } from "./PatientSuperbillsSection";
import { User, FileText } from "lucide-react";

interface PatientProfileTabsProps {
  patient: PatientProfileType;
  onEdit: () => void;
}

export function PatientProfileTabs({ patient, onEdit }: PatientProfileTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="superbills" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Superbills
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-4">
        <PatientViewMode patient={patient} onEdit={onEdit} />
      </TabsContent>
      
      <TabsContent value="superbills" className="mt-4">
        <PatientSuperbillsSection patient={patient} />
      </TabsContent>
    </Tabs>
  );
}
