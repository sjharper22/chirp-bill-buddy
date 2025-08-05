
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils/superbill-utils";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export function DateRangeSelector({ dateRange, onDateRangeChange }: DateRangeSelectorProps) {
  const [fromMonth, setFromMonth] = useState<Date | undefined>(dateRange.from);
  const [toMonth, setToMonth] = useState<Date | undefined>(dateRange.to);
  
  // Update displayed months when dateRange changes
  useEffect(() => {
    setFromMonth(dateRange.from);
    setToMonth(dateRange.to);
  }, [dateRange.from, dateRange.to]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date Range</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal min-w-0">
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {dateRange.from ? formatDate(dateRange.from) : "From date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
            side="bottom"
            avoidCollisions={true}
            collisionPadding={10}
          >
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
              initialFocus
              month={fromMonth}
              defaultMonth={dateRange.from || new Date()}
              className="p-3"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal min-w-0">
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {dateRange.to ? formatDate(dateRange.to) : "To date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
            side="bottom"
            avoidCollisions={true}
            collisionPadding={10}
          >
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
              initialFocus
              month={toMonth}
              defaultMonth={dateRange.to || new Date()}
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
