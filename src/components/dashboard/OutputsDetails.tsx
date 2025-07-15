import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useDashboard } from '@/contexts/DashboardContext';
import { getProjectOutputs, getProjectKPIs } from '@/lib/icsData';

export function OutputsDetails() {
  const { projectId } = useParams();
  const { user } = useDashboard();
  if (!projectId) {
    return <div>No project selected</div>;
  }
  const outputs = getProjectOutputs(user, projectId);
  const allKPIs = getProjectKPIs(user, projectId);
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);

  const filteredOutputs = selectedOutput
    ? outputs.filter((o: any) => o.id === selectedOutput)
    : outputs;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'behind':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col space-y-8 overflow-x-hidden w-full max-w-full px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4 w-full max-w-full">
        <h1 className="text-3xl font-bold text-foreground flex-1 break-words whitespace-normal">Project Outputs & KPIs</h1>
        <select
          className="border rounded px-3 py-2 text-base min-w-0 w-full md:w-auto"
          value={selectedOutput || ''}
          onChange={e => setSelectedOutput(e.target.value || undefined)}
        >
          <option value="">All Outputs</option>
          {outputs.map((o: any) => (
            <option key={o.id} value={o.id}>{o.title}</option>
          ))}
        </select>
      </div>
      {filteredOutputs.map((output: any) => {
        const outputKPIs = allKPIs.filter((k: any) => k.outputId === output.id);
        return (
          <Card key={output.id} className="transition-all duration-200 hover:shadow-md break-words whitespace-normal w-full max-w-full">
            <CardHeader className="w-full max-w-full">
              <CardTitle className="break-words whitespace-normal w-full max-w-full">{output.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2 w-full max-w-full">
                <Badge className={getStatusColor(output.status)}>{output.status}</Badge>
                <span className="text-muted-foreground break-words whitespace-normal w-full max-w-full">{output.description}</span>
              </div>
            </CardHeader>
            <CardContent className="w-full max-w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 w-full max-w-full">
                <Card className="transition-all duration-200 hover:shadow-md break-words whitespace-normal w-full max-w-full min-w-0">
                  <CardHeader className="w-full max-w-full min-w-0">
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full max-w-full min-w-0">
                    <div className="text-2xl font-bold text-foreground">{Math.round((output.current / output.target) * 100)}%</div>
                    <Progress value={Math.round((output.current / output.target) * 100)} />
                  </CardContent>
                </Card>
                <Card className="transition-all duration-200 hover:shadow-md break-words whitespace-normal w-full max-w-full min-w-0">
                  <CardHeader className="w-full max-w-full min-w-0">
                    <CardTitle>Target</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full max-w-full min-w-0">
                    <div className="text-2xl font-bold text-foreground">{output.target} {output.unit}</div>
                  </CardContent>
                </Card>
              </div>
              {outputKPIs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-full">
                  {outputKPIs.map((kpi: any, idx: number) => (
                    <Card key={idx} className="bg-muted/50 break-words whitespace-normal w-full max-w-full min-w-0">
                      <CardHeader className="w-full max-w-full min-w-0">
                        <CardTitle className="text-base font-semibold break-words whitespace-normal w-full max-w-full">{kpi.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="break-words whitespace-normal w-full max-w-full min-w-0">
                        {kpi.type === 'radialGauge' && (
                          <RadialGauge value={kpi.value} size={120} unit={kpi.unit} primaryColor="#3B82F6" />
                        )}
                        {kpi.type === 'bar' && (
                          <StackedBarChart
                            data={[{ name: kpi.name, Actual: kpi.value, Target: kpi.target }]}
                            height={120}
                            colors={["#3B82F6", "#E5E7EB"]}
                          />
                        )}
                        {kpi.type === 'progress' && (
                          <div className="w-full max-w-full min-w-0">
                            <div className="mb-2 text-sm font-medium">{kpi.value} / {kpi.target} {kpi.unit}</div>
                            <Progress value={(kpi.value / kpi.target) * 100} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 