import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BulletChartProps {
  current: number;
  target: number;
  title: string;
  unit?: string;
  height?: number;
  qualitativeRanges?: { poor: number; satisfactory: number; good: number };
}

export function BulletChart({ 
  current, 
  target, 
  title, 
  unit = '', 
  height = 80,
  qualitativeRanges = { poor: target * 0.6, satisfactory: target * 0.8, good: target }
}: BulletChartProps) {
  const data = [
    {
      name: title,
      poor: qualitativeRanges.poor,
      satisfactory: qualitativeRanges.satisfactory - qualitativeRanges.poor,
      good: qualitativeRanges.good - qualitativeRanges.satisfactory,
      current: current
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-2">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">
          {current} / {target} {unit}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, target * 1.2]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="poor" stackId="a" fill="#EF4444" />
          <Bar dataKey="satisfactory" stackId="a" fill="#F59E0B" />
          <Bar dataKey="good" stackId="a" fill="#10B981" />
          <ReferenceLine x={target} stroke="#1F2937" strokeWidth={2} />
          <ReferenceLine x={current} stroke="#3B82F6" strokeWidth={3} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>0</span>
        <span className="text-foreground font-medium">Target: {target}</span>
        <span>{Math.round(target * 1.2)}</span>
      </div>
    </div>
  );
}