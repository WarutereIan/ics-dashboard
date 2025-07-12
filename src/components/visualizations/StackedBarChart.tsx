import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StackedBarChartProps {
  data: any[];
  height?: number;
  colors?: string[];
}

export function StackedBarChart({ data, height = 300, colors = ['#3B82F6', '#14B8A6', '#F97316', '#EF4444'] }: StackedBarChartProps) {
  // Extract stack keys from data (excluding 'name' field)
  const stackKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'name') : [];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Legend />
        {stackKeys.map((key, index) => (
          <Bar 
            key={key}
            dataKey={key} 
            stackId="a" 
            fill={colors[index % colors.length]}
            radius={index === stackKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}