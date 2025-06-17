
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateOfBirthFieldProps {
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  disabled?: boolean;
}

export function DateOfBirthField({ value, onChange, error, disabled = false }: DateOfBirthFieldProps) {
  // Track the month to display when the calendar is opened
  const [displayedMonth, setDisplayedMonth] = useState<Date | undefined>(value);
  
  // Update displayedMonth when value changes
  useEffect(() => {
    setDisplayedMonth(value);
  }, [value]);

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // Create date at noon to avoid timezone issues
      const [year, month, day] = e.target.value.split('-').map(Number);
      const date = new Date(year, month - 1, day, 12, 0, 0);
      if (!isNaN(date.getTime())) {
        onChange(date);
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      // Create a new date at noon to avoid timezone issues
      const adjustedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      onChange(adjustedDate);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="dob" className={error ? "text-destructive" : ""}>
        Date of Birth
      </Label>
      <div className="flex gap-2">
        <Input
          type="date"
          id="dob"
          value={value ? format(value, "yyyy-MM-dd") : ""}
          onChange={handleDateInput}
          className={cn(
            "flex-1",
            error ? "border-destructive" : ""
          )}
          disabled={disabled}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              type="button"
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              initialFocus
              month={displayedMonth}
              onMonthChange={setDisplayedMonth}
              defaultMonth={value}
              className={cn("p-3 pointer-events-auto")}
              fromYear={1900}
              toYear={new Date().getFullYear()}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}
