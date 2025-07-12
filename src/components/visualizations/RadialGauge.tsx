import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RadialGaugeProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  primaryColor?: string;
  backgroundColor?: string;
  showValue?: boolean;
  unit?: string;
  autoColorCode?: boolean;
  colorThresholds?: {
    low: { threshold: number; color: string };
    medium: { threshold: number; color: string };
    high: { threshold: number; color: string };
  };
}

export function RadialGauge({ 
  value, 
  max = 100, 
  size = 120, 
  thickness = 8,
  primaryColor = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showValue = true,
  unit = '%',
  autoColorCode = false,
  colorThresholds = {
    low: { threshold: 50, color: '#EF4444' },
    medium: { threshold: 80, color: '#F59E0B' },
    high: { threshold: 100, color: '#10B981' }
  }
}: RadialGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColorBasedOnValue = () => {
    if (!autoColorCode) return primaryColor;
    
    if (percentage < colorThresholds.low.threshold) {
      return colorThresholds.low.color;
    } else if (percentage < colorThresholds.medium.threshold) {
      return colorThresholds.medium.color;
    } else {
      return colorThresholds.high.color;
    }
  };

  const activeColor = getColorBasedOnValue();
  
  const data = [
    { name: 'completed', value: percentage },
    { name: 'remaining', value: 100 - percentage }
  ];

  const COLORS = [activeColor, backgroundColor];

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={size / 2 - thickness}
            outerRadius={size / 2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(value)}
            </div>
            <div className="text-sm text-muted-foreground">
              {unit}
            </div>
          </div>
        </div>
      )}
      
      {autoColorCode && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500" title="< 50%" />
            <div className="w-2 h-2 rounded-full bg-amber-500" title="50-79%" />
            <div className="w-2 h-2 rounded-full bg-green-500" title="≥ 80%" />
          </div>
        </div>
      )}
    </div>
  );
}