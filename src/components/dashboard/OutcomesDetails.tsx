import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { Outcome } from '@/types/dashboard';

export function OutcomesDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { getProjectOutcomes, getProjectKPIs, dataRefreshTrigger } = useProjects();
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [allKPIs, setAllKPIs] = useState<any[]>([]);

  if (!user) return null;
  if (!projectId) {
    return <div>No project selected</div>;
  }

  // Load project data
  useEffect(() => {
    const loadData = async () => {
      if (projectId && user) {
        try {
          console.log(`🔄 OutcomesDetails: Loading data for project ${projectId} (refresh trigger: ${dataRefreshTrigger})`);
          const [outcomesData, kpisData] = await Promise.all([
            getProjectOutcomes(projectId),
            getProjectKPIs(projectId)
          ]);
          setOutcomes(outcomesData);
          setAllKPIs(kpisData);
          console.log(`✅ OutcomesDetails: Loaded ${outcomesData.length} outcomes, ${kpisData.length} KPIs`);
        } catch (error) {
          console.error('Error loading outcomes data:', error);
        }
      }
    };

    loadData();
  }, [projectId, user, getProjectOutcomes, getProjectKPIs, dataRefreshTrigger]);

  const filteredOutcomes = selectedOutcome
    ? outcomes.filter((o: any) => o.id === selectedOutcome)
    : outcomes;

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
        <h1 className="text-3xl font-bold text-foreground flex-1 break-words whitespace-normal">Project Outcomes & KPIs</h1>
        <select
          className="border rounded px-3 py-2 text-base min-w-0 w-full md:w-auto"
          value={selectedOutcome || ''}
          onChange={e => setSelectedOutcome(e.target.value || undefined)}
        >
          <option value="">All Outcomes</option>
          {outcomes.map((o: any) => (
            <option key={o.id} value={o.id}>{o.title}</option>
          ))}
        </select>
      </div>
      {filteredOutcomes.map((outcome: any) => {
        const outcomeKPIs = allKPIs.filter((k: any) => k.outcomeId === outcome.id);
        return (
          <Card key={outcome.id} className="transition-all duration-200 hover:shadow-md break-words whitespace-normal w-full max-w-full">
            <CardHeader className="w-full max-w-full">
              <CardTitle className="break-words whitespace-normal w-full max-w-full">{outcome.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2 w-full max-w-full">
                <Badge className={getStatusColor(outcome.status)}>{outcome.status}</Badge>
                <span className="text-muted-foreground break-words whitespace-normal w-full max-w-full">{outcome.description}</span>
              </div>
            </CardHeader>
            <CardContent className="w-full max-w-full">
              {outcomeKPIs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-full">
                  {outcomeKPIs.map((kpi: any, idx: number) => (
                    <Card key={idx} className="bg-muted/50 break-words whitespace-normal w-full max-w-full min-w-0">
                      <CardHeader className="w-full max-w-full min-w-0">
                        <CardTitle className="text-base font-semibold break-words whitespace-normal w-full max-w-full">{kpi.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="break-words whitespace-normal w-full max-w-full min-w-0">
                        {kpi.type === 'radialGauge' && (
                          <RadialGauge value={kpi.current || kpi.value} size={120} unit={kpi.unit} primaryColor="#3B82F6" />
                        )}
                        {kpi.type === 'bar' && (
                          <StackedBarChart
                            data={[
                              { name: kpi.name, Actual: kpi.current || kpi.value, Target: kpi.target }
                            ]}
                            height={120}
                            colors={["#3B82F6", "#E5E7EB"]}
                          />
                        )}
                        {kpi.type === 'progress' && (
                          <div className="w-full max-w-full min-w-0">
                            <div className="mb-2 text-sm font-medium">{kpi.current || kpi.value} / {kpi.target} {kpi.unit}</div>
                            <Progress value={((kpi.current || kpi.value) / kpi.target) * 100} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">No KPIs for this outcome.</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 