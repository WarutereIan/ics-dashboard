import React from 'react';
import { cn } from '@/lib/utils';

interface LikertScaleChartProps {
  data: Array<{
    question: string;
    responses: {
      stronglyDisagree: number;
      disagree: number;
      neutral: number;
      agree: number;
      stronglyAgree: number;
    };
  }>;
  height?: number;
  className?: string;
}

export function LikertScaleChart({
  data,
  height = 300,
  className = ""
}: LikertScaleChartProps) {
  const colors = {
    stronglyDisagree: 'bg-red-500',
    disagree: 'bg-red-300',
    neutral: 'bg-gray-300',
    agree: 'bg-green-300',
    stronglyAgree: 'bg-green-500'
  };

  const labels = {
    stronglyDisagree: 'Strongly Disagree',
    disagree: 'Disagree',
    neutral: 'Neutral',
    agree: 'Agree',
    stronglyAgree: 'Strongly Agree'
  };

  const getPercentage = (value: number, total: number) => {
    return (value / total) * 100;
  };

  return (
    <div className={cn("w-full space-y-6", className)} style={{ minHeight: height }}>
      {data.map((item, index) => {
        const total = Object.values(item.responses).reduce((sum, val) => sum + val, 0);
        
        return (
          <div key={index} className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">{item.question}</h4>
            
            {/* Horizontal bar chart */}
            <div className="flex w-full h-8 rounded-lg overflow-hidden border border-border">
              {Object.entries(item.responses).map(([key, value]) => {
                const percentage = getPercentage(value, total);
                return (
                  <div
                    key={key}
                    className={cn(colors[key as keyof typeof colors], "transition-all duration-200")}
                    style={{ width: `${percentage}%` }}
                    title={`${labels[key as keyof typeof labels]}: ${value} (${percentage.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
            
            {/* Values display */}
            <div className="flex justify-between text-xs text-muted-foreground">
              {Object.entries(item.responses).map(([key, value]) => (
                <span key={key} className="text-center">
                  {value}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2">
            <div className={cn("w-4 h-4 rounded", colors[key as keyof typeof colors])} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 