import React, { useState } from 'react';
import { useProjects } from '@/contexts/ProjectsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowPathIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';


export function ProjectsApiTest() {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    refreshProjects, 
    isLoading, 
    error 
  } = useProjects();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCreateProject = async () => {
    setIsCreating(true);
    try {
      await addProject({
        name: 'Test Project ' + Date.now(),
        description: 'A test project created via API',
        country: 'Kenya',
        status: 'PLANNING',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        progress: 0,
        budget: 100000,
        spent: 0,
        backgroundInformation: 'This is a test project to verify API integration.',
        createdBy: 'test-user',
        updatedBy: 'test-user'
      });
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async (id: string) => {
    setIsUpdating(id);
    try {
      await updateProject(id, {
        progress: Math.min(100, Math.floor(Math.random() * 100)),
        status: 'ACTIVE' as const
      });
    } catch (err) {
      console.error('Failed to update project:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteProject(id);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNING': return 'bg-emerald-100 text-emerald-800';
      case 'COMPLETED': return 'bg-emerald-100 text-purple-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Projects API Test</span>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateProject} 
                disabled={isCreating}
                size="sm"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusIcon className="h-4 w-4" />
                )}
                {isCreating ? 'Creating...' : 'Add Test Project'}
              </Button>
              <Button 
                onClick={refreshProjects} 
                variant="outline" 
                size="sm"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-emerald-100 border border-red-300 rounded text-emerald-700">
              Error: {error}
            </div>
          )}
          
          <div className="text-sm text-gray-600 mb-4">
            Total Projects: {projects.length}
          </div>

          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{project.country}</span>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span>Progress: {project.progress}%</span>
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                    </div>
                    {project.backgroundInformation && (
                      <p className="text-gray-500 text-sm mt-2">
                        {project.backgroundInformation.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleUpdateProject(project.id)}
                      disabled={isUpdating === project.id}
                      size="sm"
                      variant="outline"
                    >
                      {isUpdating === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PencilIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={isDeleting === project.id}
                      size="sm"
                      variant="destructive"
                    >
                      {isDeleting === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No projects found. Create a test project to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
