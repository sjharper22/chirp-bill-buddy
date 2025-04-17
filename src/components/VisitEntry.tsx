
import { useState } from "react";
import { Visit } from "@/types/superbill";
import { duplicateVisit, formatCurrency, formatDate } from "@/lib/utils/superbill-utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { commonICD10Codes, commonCPTCodes } from "@/lib/utils/superbill-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface VisitEntryProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
  onDuplicate: (visit: Visit) => void;
  onDelete: (id: string) => void;
}

export function VisitEntry({ visit, onVisitChange, onDuplicate, onDelete }: VisitEntryProps) {
  const [showNotes, setShowNotes] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onVisitChange({ ...visit, date });
    }
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onVisitChange({ ...visit, fee: value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onVisitChange({ ...visit, notes: e.target.value });
  };

  const addIcdCode = (code: string) => {
    if (!visit.icdCodes.includes(code)) {
      onVisitChange({ ...visit, icdCodes: [...visit.icdCodes, code] });
    }
  };

  const removeIcdCode = (code: string) => {
    onVisitChange({ ...visit, icdCodes: visit.icdCodes.filter(c => c !== code) });
  };

  const addCptCode = (code: string) => {
    if (!visit.cptCodes.includes(code)) {
      onVisitChange({ ...visit, cptCodes: [...visit.cptCodes, code] });
    }
  };

  const removeCptCode = (code: string) => {
    onVisitChange({ ...visit, cptCodes: visit.cptCodes.filter(c => c !== code) });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Visit Date */}
          <div className="w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[180px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(visit.date) || "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={visit.date}
                  onSelect={handleDateChange}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Fee */}
          <div className="w-full sm:w-auto">
            <Input
              type="number"
              placeholder="Fee"
              value={visit.fee || ""}
              onChange={handleFeeChange}
              className="w-full sm:w-[120px]"
              min={0}
              step={0.01}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex ml-auto gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onDuplicate(duplicateVisit(visit))}
              title="Duplicate visit"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onDelete(visit.id)}
              title="Delete visit"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ICD-10 Codes */}
        <div className="mt-3">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">ICD-10 Codes:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Add ICD-10</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                {commonICD10Codes.map(code => (
                  <DropdownMenuItem
                    key={code.value}
                    onClick={() => addIcdCode(code.value)}
                    disabled={visit.icdCodes.includes(code.value)}
                  >
                    {code.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {visit.icdCodes.map(code => (
              <Badge key={code} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => removeIcdCode(code)}>
                {code} <span className="ml-1 text-muted-foreground">×</span>
              </Badge>
            ))}
            {visit.icdCodes.length === 0 && (
              <span className="text-sm text-muted-foreground">No ICD-10 codes selected</span>
            )}
          </div>
        </div>

        {/* CPT Codes */}
        <div className="mt-3">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">CPT Codes:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Add CPT</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                {commonCPTCodes.map(code => (
                  <DropdownMenuItem
                    key={code.value}
                    onClick={() => addCptCode(code.value)}
                    disabled={visit.cptCodes.includes(code.value)}
                  >
                    {code.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {visit.cptCodes.map(code => (
              <Badge key={code} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => removeCptCode(code)}>
                {code} <span className="ml-1 text-muted-foreground">×</span>
              </Badge>
            ))}
            {visit.cptCodes.length === 0 && (
              <span className="text-sm text-muted-foreground">No CPT codes selected</span>
            )}
          </div>
        </div>

        {/* Notes Toggle */}
        <div className="mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowNotes(!showNotes)}
            className="text-xs p-0 h-auto"
          >
            {showNotes ? "Hide Notes" : "Add Notes"}
          </Button>
          
          {showNotes && (
            <Textarea
              placeholder="Visit notes..."
              value={visit.notes || ""}
              onChange={handleNotesChange}
              className="mt-2"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
