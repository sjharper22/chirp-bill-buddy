
import { useState, useEffect } from "react";
import { Visit } from "@/services/visitService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiTagInput } from "@/components/MultiTagInput";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VisitFormProps {
  visit?: Visit | null;
  onSubmit: (visitData: any) => void;
  onCancel: () => void;
}

export function VisitForm({ visit, onSubmit, onCancel }: VisitFormProps) {
  const [formData, setFormData] = useState({
    visit_date: visit?.visit_date ? new Date(visit.visit_date) : new Date(),
    icd_codes: (visit?.icd_codes as string[]) || [],
    cpt_codes: (visit?.cpt_codes as string[]) || [],
    cpt_code_entries: visit?.cpt_code_entries || [], // Add support for itemized CPT codes
    main_complaints: (visit?.main_complaints as string[]) || [],
    fee: visit?.fee || 0,
    notes: visit?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      visit_date: formData.visit_date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    };
    
    onSubmit(submitData);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, visit_date: date }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visit Date */}
          <div className="space-y-2">
            <Label htmlFor="visit_date">Visit Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.visit_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.visit_date ? format(formData.visit_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.visit_date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Fee */}
          <div className="space-y-2">
            <Label htmlFor="fee">Fee ($)</Label>
            <Input
              id="fee"
              type="number"
              step="0.01"
              min="0"
              value={formData.fee}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                fee: parseFloat(e.target.value) || 0 
              }))}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical Codes & Complaints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ICD Codes */}
          <div className="space-y-2">
            <Label>ICD-10 Codes</Label>
            <MultiTagInput
              value={formData.icd_codes}
              onChange={(codes) => setFormData(prev => ({ ...prev, icd_codes: codes }))}
              placeholder="Enter ICD-10 codes (e.g., M54.5)"
            />
          </div>

          {/* CPT Codes */}
          <div className="space-y-2">
            <Label>CPT Codes</Label>
            <MultiTagInput
              value={formData.cpt_codes}
              onChange={(codes) => setFormData(prev => ({ ...prev, cpt_codes: codes }))}
              placeholder="Enter CPT codes (e.g., 99213)"
            />
          </div>

          {/* Main Complaints */}
          <div className="space-y-2">
            <Label>Main Complaints</Label>
            <MultiTagInput
              value={formData.main_complaints}
              onChange={(complaints) => setFormData(prev => ({ ...prev, main_complaints: complaints }))}
              placeholder="Enter main complaints"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about this visit..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {visit ? "Update Visit" : "Create Visit"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
