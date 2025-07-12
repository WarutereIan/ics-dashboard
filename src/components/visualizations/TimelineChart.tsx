import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

interface TimelineChartProps {
  data: any[];
  height?: number;
  lineColor?: string;
  targetValue?: number;
}

export function TimelineChart({ 
  data, 
  height = 300, 
  lineColor = '#3B82F6',
  targetValue 
}: TimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => format(new Date(value), 'MMM yy')}
          className="text-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip 
          labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={lineColor} 
          strokeWidth={3}
          dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
        />
        {targetValue && (
          <ReferenceLine 
            y={targetValue} 
            stroke="#EF4444" 
            strokeDasharray="5 5"
            label={{ value: "Target", position: "insideTopRight" }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}