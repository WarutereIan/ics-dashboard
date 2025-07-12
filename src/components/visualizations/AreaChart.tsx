import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface AreaChartProps {
  data: Array<{ date: string; value: number; cumulative?: number }>;
  height?: number;
  areaColor?: string;
  showCumulative?: boolean;
}

export function AreaChart({ 
  data, 
  height = 300, 
  areaColor = '#3B82F6',
  showCumulative = false 
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={areaColor} 
          fill={areaColor}
          fillOpacity={0.3}
          strokeWidth={2}
        />
        {showCumulative && (
          <Area 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#14B8A6" 
            fill="#14B8A6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}