import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  height?: number;
  bars?: Array<{
    dataKey: string;
    fill: string;
    name: string;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function BarChart({
  data,
  height = 300,
  bars = [{ dataKey: 'value', fill: '#14B8A6', name: 'Value' }],
  showGrid = true,
  showLegend = true,
  orientation = 'vertical',
  className = ""
}: BarChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart 
          data={data}
          layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          )}
          <XAxis
            dataKey={orientation === 'horizontal' ? undefined : 'date'}
            type={orientation === 'horizontal' ? 'number' : 'category'}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            dataKey={orientation === 'horizontal' ? 'date' : undefined}
            type={orientation === 'horizontal' ? 'category' : 'number'}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          {showLegend && <Legend />}
          
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
} 