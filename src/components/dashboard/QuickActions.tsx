
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LayoutTemplate, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Add and manage your patient profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => navigate("/patients")}>
            <Users className="mr-2 h-4 w-4" />
            Manage Patients
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>Create and manage your code templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => navigate("/templates")}>
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Manage Templates
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>Create grouped submissions for insurance</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => navigate("/grouped-submission")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Group Submissions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
