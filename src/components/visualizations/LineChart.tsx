import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LineChartProps {
  data: any[];
  height?: number;
  lines?: Array<{
    dataKey: string;
    color: string;
    name: string;
    strokeWidth?: number;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
  milestones?: Array<{
    x: string | number;
    label: string;
    color?: string;
  }>;
  className?: string;
}

export function LineChart({
  data,
  height = 300,
  lines = [{ dataKey: 'value', color: '#14B8A6', name: 'Value' }],
  showGrid = true,
  showLegend = true,
  milestones = [],
  className = ""
}: LineChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          )}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
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
          
          {/* Milestone markers */}
          {milestones.map((milestone, index) => (
            <ReferenceLine
              key={index}
              x={milestone.x}
              stroke={milestone.color || '#ef4444'}
              strokeDasharray="4 4"
              label={{
                value: milestone.label,
                position: 'top',
                style: { fontSize: '12px', fill: '#64748b' }
              }}
            />
          ))}
          
          {/* Data lines */}
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              name={line.name}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: line.color }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
} 