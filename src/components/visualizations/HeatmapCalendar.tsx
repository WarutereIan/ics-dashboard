import React from 'react';
import { cn } from '@/lib/utils';

interface HeatmapCalendarProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
  className?: string;
  maxValue?: number;
}

export function HeatmapCalendar({
  data,
  height = 200,
  className = "",
  maxValue
}: HeatmapCalendarProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  const getIntensityColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = value / max;
    if (intensity <= 0.25) return 'bg-red-200';
    if (intensity <= 0.5) return 'bg-red-300';
    if (intensity <= 0.75) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getMonthName = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short' });
  };

  const getDayOfWeek = (date: string) => {
    return new Date(date).getDay();
  };

  // Group data by month
  const groupedData = data.reduce((acc, item) => {
    const month = getMonthName(item.date);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-3 gap-4" style={{ height }}>
        {Object.entries(groupedData).map(([month, monthData]) => (
          <div key={month} className="space-y-2">
            <h4 className="text-sm font-medium text-center">{month}</h4>
            <div className="grid grid-cols-7 gap-1">
              {monthData.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110",
                    getIntensityColor(item.value)
                  )}
                  title={`${item.date}: ${item.value} incidents`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-red-200 rounded-sm" />
          <div className="w-3 h-3 bg-red-300 rounded-sm" />
          <div className="w-3 h-3 bg-red-400 rounded-sm" />
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
} 