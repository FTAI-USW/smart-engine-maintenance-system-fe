
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { TaskActivity } from "@/components/dashboard/TaskActivity";
import { getProjects, getTasks, getTasksByAssignee } from "@/lib/storage";
import { Project, Task } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/projects/ProjectCard";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Load projects and tasks based on user role
    if (currentUser.role === "technician") {
      // For technicians, show only their assigned tasks and related projects
      const userTasks = getTasksByAssignee(currentUser.id);
      setTasks(userTasks);
      
      // Get unique project IDs from tasks
      const projectIds = Array.from(new Set(userTasks.map(task => task.projectId)));
      const userProjects = getProjects().filter(project => projectIds.includes(project.id));
      setProjects(userProjects);
    } else {
      // For supervisors and admins, show all projects and tasks
      setProjects(getProjects());
      setTasks(getTasks());
    }
  }, [currentUser]);
  
  if (!currentUser) return null;
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name}
          </p>
        </div>
        
        <DashboardSummary projects={projects} tasks={tasks} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskActivity tasks={tasks} />
          
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects found</p>
              ) : (
                <div className="space-y-4">
                  {projects
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 3)
                    .map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
