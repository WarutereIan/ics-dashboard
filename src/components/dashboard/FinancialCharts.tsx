import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialSummary } from '@/types/dashboard';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { MuiThemeProvider } from '../theme/MuiThemeProvider';

interface FinancialChartsProps {
  summary: FinancialSummary;
}

export function FinancialCharts({ summary }: FinancialChartsProps) {
  // Prepare quarterly data for MUI-X charts
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const budgetData = [
    summary.byQuarter.q1.budget,
    summary.byQuarter.q2.budget,
    summary.byQuarter.q3.budget,
    summary.byQuarter.q4.budget,
  ];
  const spentData = [
    summary.byQuarter.q1.spent,
    summary.byQuarter.q2.spent,
    summary.byQuarter.q3.spent,
    summary.byQuarter.q4.spent,
  ];
  const varianceData = [
    summary.byQuarter.q1.variance,
    summary.byQuarter.q2.variance,
    summary.byQuarter.q3.variance,
    summary.byQuarter.q4.variance,
  ];

  // Activity data is not available in the new API structure
  // We'll use quarterly data for now and add activity charts later when needed
  const activityLabels: string[] = [];
  const activityBudgetData: number[] = [];
  const activitySpentData: number[] = [];

  // Prepare pie chart data for budget vs spent
  const pieData = [
    { id: 0, value: summary.totalSpent, label: 'Spent', color: '#f97316' },
    { id: 1, value: Math.max(0, summary.totalBudget - summary.totalSpent), label: 'Remaining', color: '#3b82f6' },
  ].filter(item => item.value > 0);

  // Format currency for tooltips
  const formatCurrency = (value: number | null) => {
    if (value === null) return '$0';
    return `$${value.toLocaleString()}`;
  };

  // Format currency for PieChart (different signature required)
  const formatPieCurrency = (value: any) => {
    const numValue = typeof value === 'object' && value !== null ? value.value : value;
    if (numValue === null || numValue === undefined) return '$0';
    return `$${numValue.toLocaleString()}`;
  };

  return (
    <MuiThemeProvider>
      <div className="space-y-6">
      {/* Quarterly Budget vs Spent Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Budget vs Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 350 }}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: quarters }]}
              series={[
                { 
                  data: budgetData, 
                  label: 'Budget',
                  color: '#3b82f6',
                  valueFormatter: formatCurrency
                },
                { 
                  data: spentData, 
                  label: 'Spent',
                  color: '#f97316',
                  valueFormatter: formatCurrency
                },
              ]}
              width={undefined}
              height={300}
              margin={{ left: 80, right: 20, top: 20, bottom: 40 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget Utilization Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 350 }}>
            <HiChartPie
              series={[
                {
                  data: pieData,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  valueFormatter: formatPieCurrency,
                },
              ]}
              height={300}
              margin={{ right: 200 }}
              slotProps={{
                legend: {
                  direction: 'column' as any,
                  position: { vertical: 'middle', horizontal: 'end' },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Spending Chart */}
      {activityLabels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 350 }}>
              <BarChart
                xAxis={[{ 
                  scaleType: 'band', 
                  data: activityLabels,
                }]}
                series={[
                  { 
                    data: activityBudgetData, 
                    label: 'Budget',
                    color: '#3b82f6',
                    valueFormatter: formatCurrency
                  },
                  { 
                    data: activitySpentData, 
                    label: 'Spent',
                    color: '#f97316',
                    valueFormatter: formatCurrency
                  },
                ]}
                width={undefined}
                height={300}
                margin={{ left: 80, right: 20, top: 20, bottom: 60 }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Variance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 350 }}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: quarters }]}
              series={[
                { 
                  data: varianceData, 
                  label: 'Variance',
                  color: '#10b981',
                  valueFormatter: formatCurrency
                },
              ]}
              width={undefined}
              height={300}
              margin={{ left: 80, right: 20, top: 20, bottom: 40 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 350 }}>
            <LineChart
              xAxis={[{ scaleType: 'point', data: quarters }]}
              series={[
                {
                  data: budgetData,
                  label: 'Budget',
                  color: '#3b82f6',
                  valueFormatter: formatCurrency,
                },
                {
                  data: spentData,
                  label: 'Spent',
                  color: '#f97316',
                  valueFormatter: formatCurrency,
                },
              ]}
              width={undefined}
              height={300}
              margin={{ left: 80, right: 20, top: 20, bottom: 40 }}
            />
          </div>
        </CardContent>
      </Card>
      </div>
    </MuiThemeProvider>
  );
}
