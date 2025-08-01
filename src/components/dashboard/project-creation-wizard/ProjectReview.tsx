import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectFormData, OutcomeFormData, ActivityFormData, KPIFormData } from './types';

interface ProjectReviewProps {
  projectData: ProjectFormData;
  outcomes: OutcomeFormData[];
  activities: ActivityFormData[];
  kpis: KPIFormData[];
}

export function ProjectReview({ 
  projectData, 
  outcomes, 
  activities, 
  kpis 
}: ProjectReviewProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Project Review</h3>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{projectData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Country</p>
              <p className="font-medium">{projectData.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge>{projectData.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium">${projectData.budget.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Description</p>
            <p>{projectData.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{outcomes.length}</p>
              <p className="text-sm text-gray-600">Outcomes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activities.length}</p>
              <p className="text-sm text-gray-600">Activities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{kpis.length}</p>
              <p className="text-sm text-gray-600">KPIs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outcomes Summary */}
      {outcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outcomes Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{outcome.title}</h4>
                  <p className="text-sm text-gray-600">{outcome.description}</p>
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>Target: {outcome.target} {outcome.unit}</span>
                    <span>Activities: {activities.filter(a => a.outcomeId === outcome.id).length}</span>
                    <span>KPIs: {kpis.filter(k => k.outcomeId === outcome.id).length}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}