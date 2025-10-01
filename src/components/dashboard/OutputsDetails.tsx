import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';

export function OutputsDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { getProjectOutputs, getProjectKPIs, dataRefreshTrigger } = useProjects();
  const [outputs, setOutputs] = useState<any[]>([]);
  const [allKPIs, setAllKPIs] = useState<any[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);

  if (!user) return null;
  if (!projectId) {
    return <div>No project selected</div>;
  }

  // Load project data
  useEffect(() => {
    const loadData = async () => {
      if (projectId && user) {
        try {
          const [outputsData, kpisData] = await Promise.all([
            getProjectOutputs(projectId),
            getProjectKPIs(projectId)
          ]);
          
          // Inject mock values for vacis-ke (maintaining existing functionality)
          let processedOutputs = outputsData;
          if (projectId === 'vacis-ke') {
            processedOutputs = outputsData.map((o: any, idx: number) => ({
              ...o,
              current: typeof o.current === 'number' ? o.current : Math.floor(Math.random() * 1000),
              target: typeof o.target === 'number' && o.target > 0 ? o.target : 1000 + idx * 100,
              unit: o.unit || 'units',
              description: o.description || 'Simulated output for demonstration.'
            }));
          }
          
          setOutputs(processedOutputs);
          setAllKPIs(kpisData);
        } catch (error) {
          console.error('Error loading outputs data:', error);
        }
      }
    };

    loadData();
  }, [projectId, user, getProjectOutputs, getProjectKPIs, dataRefreshTrigger]);

  const filteredOutputs = selectedOutput
    ? outputs.filter((o: any) => o.id === selectedOutput)
    : outputs;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
        return 'bg-green-100 text-green-800';
      case 'AT_RISK':
        return 'bg-yellow-100 text-yellow-800';
      case 'BEHIND':
        return 'bg-emerald-100 text-emerald-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col space-y-8 overflow-x-hidden w-full">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4 w-full max-w-full">
        <h1 className="text-3xl font-bold text-foreground flex-1 break-words whitespace-normal">Project Outputs & KPIs</h1>
     {/*    <select
          className="border rounded px-3 py-2 text-base min-w-0 w-full md:w-auto whitespace-normal break-words"
          value={selectedOutput || ''}
          onChange={e => setSelectedOutput(e.target.value || undefined)}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <option value="">All Outputs</option>
          {outputs.map((o: any) => (
            <option key={o.id} value={o.id} className="whitespace-normal break-words">
              {o.title}
            </option>
          ))}
        </select> */}
      </div>
      {filteredOutputs.map((output: any) => {
        const outputKPIs = allKPIs.filter((k: any) => k.outputId === output.id);
        const progress = output.target > 0 ? Math.round((output.current / output.target) * 100) : 0;
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
                    <div className="text-2xl font-bold text-foreground">{progress}%</div>
                    <Progress value={progress} />
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
                            <Progress value={kpi.target > 0 ? (kpi.value / kpi.target) * 100 : 0} />
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