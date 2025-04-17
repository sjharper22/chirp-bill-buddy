
import { Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PatientInfoSectionProps {
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">;
  updateField: <K extends keyof Omit<Superbill, "id" | "createdAt" | "updatedAt">>(
    field: K,
    value: Omit<Superbill, "id" | "createdAt" | "updatedAt">[K]
  ) => void;
}

export function PatientInfoSection({ superbill, updateField }: PatientInfoSectionProps) {
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      updateField("patientDob", date);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>Enter the patient's details for this superbill</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={superbill.patientName}
              onChange={e => updateField("patientName", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientDob">Date of Birth</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                id="patientDob"
                value={superbill.patientDob ? format(superbill.patientDob, "yyyy-MM-dd") : ""}
                onChange={handleDateInput}
                className="flex-1"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={superbill.patientDob}
                    onSelect={date => date && updateField("patientDob", date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="issueDate">Invoice/Issue Date</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              id="issueDate"
              value={superbill.issueDate ? format(superbill.issueDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = new Date(e.target.value);
                if (!isNaN(date.getTime())) {
                  updateField("issueDate", date);
                }
              }}
              className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={superbill.issueDate}
                  onSelect={date => date && updateField("issueDate", date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
