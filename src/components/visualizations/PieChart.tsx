import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  interactive?: boolean;
  className?: string;
}

export function PieChart({ 
  data, 
  height = 300, 
  showLegend = true, 
  innerRadius = 0,
  interactive = true,
  className = ""
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const COLORS = ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#06B6D4'];

  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  const onPieEnter = (data: any, index: number) => {
    if (interactive) {
      setActiveIndex(index);
    }
  };

  const onPieLeave = () => {
    if (interactive) {
      setActiveIndex(null);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Value: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-semibold">
              {((data.value / data.total) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage calculations
  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = dataWithColors.map(item => ({ ...item, total }));

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={Math.min(height * 0.35, 120)}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={300}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={activeIndex === index ? '#ffffff' : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
                style={{
                  filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                  cursor: interactive ? 'pointer' : 'default'
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {interactive && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Hover over segments for detailed information
          </p>
        </div>
      )}
    </div>
  );
}