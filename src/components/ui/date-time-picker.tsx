import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateTimePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = "Pick date and time",
  disabled = false,
  className,
  dateFormat = "PPP p",
  minDate,
  maxDate,
  showTimeSelectOnly = false,
  timeIntervals = 15,
  timeCaption = "Time",
}: DateTimePickerProps) {
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
        showTimeSelect={true}
        showTimeSelectOnly={showTimeSelectOnly}
        timeIntervals={timeIntervals}
        timeCaption={timeCaption}
        dateFormat={dateFormat}
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
            {showTimeSelectOnly ? (
              <Clock className="mr-2 h-4 w-4" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            {date ? format(date, dateFormat) : <span>{placeholder}</span>}
          </Button>
        }
      />
    </div>
  );
}

