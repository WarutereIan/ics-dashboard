import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from '@heroicons/react/24/outline';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  showTimeSelect = false,
  dateFormat = "PPP",
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (selectedDate: Date | null) => {
    onDateChange?.(selectedDate || undefined);
  };

  return (
    <div className="relative">
      <ReactDatePicker
        selected={date}
        onChange={handleDateChange}
        placeholderText={placeholder}
        disabled={disabled}
        showTimeSelect={showTimeSelect}
        dateFormat={showTimeSelect ? "PPP p" : dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        calendarClassName="shadow-lg border border-border rounded-lg"
        popperClassName="z-50"
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
            fn: (state) => state,
          },
        ]}
        customInput={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, showTimeSelect ? "PPP p" : dateFormat) : <span>{placeholder}</span>}
          </Button>
        }
      />
    </div>
  );
}
