
import { Visit } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/utils/superbill-utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface VisitDatePickerProps {
  visit: Visit;
  onVisitChange: (updatedVisit: Visit) => void;
}

export function VisitDatePicker({ visit, onVisitChange }: VisitDatePickerProps) {
  // Track the month to display when the calendar is opened
  const [displayedMonth, setDisplayedMonth] = useState<Date | undefined>(visit.date);
  
  // Update displayedMonth when visit.date changes
  useEffect(() => {
    setDisplayedMonth(visit.date);
  }, [visit.date]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onVisitChange({ ...visit, date });
    }
  };

  return (
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
          month={displayedMonth}
          defaultMonth={visit.date}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
