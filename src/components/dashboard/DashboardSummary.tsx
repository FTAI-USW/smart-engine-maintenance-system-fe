
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task, Project } from "@/types";
import { 
  Activity, 
  Clock, 
  Flag, 
  Kanban, 
  UsersIcon, 
  FileWarning,
  CheckCircle2
} from "lucide-react";
import { getUsers } from "@/lib/storage";
import { ProgressCircle } from "./ProgressCircle";

interface DashboardSummaryProps {
  projects: Project[];
  tasks: Task[];
}

export function DashboardSummary({ projects, tasks }: DashboardSummaryProps) {
  const users = getUsers();
  
  // Calculate summary statistics
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "done").length;
  const flaggedTasks = tasks.filter(task => task.isFlagged).length;
  const blockedTasks = tasks.filter(task => task.status === "blocked").length;
  
  // Calculate hours
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalLoggedHours = tasks.reduce((sum, task) => sum + task.loggedHours, 0);
  
  // Calculate task completion rate
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Calculate hours progress
  const hoursProgress = totalEstimatedHours > 0 
    ? Math.round((totalLoggedHours / totalEstimatedHours) * 100) 
    : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <Kanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            Active engine maintenance projects
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">
            Admins, supervisors, and technicians
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completion</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{completedTasks} <span className="text-sm text-muted-foreground">/ {totalTasks}</span></div>
            <p className="text-xs text-muted-foreground">
              Tasks completed
            </p>
          </div>
          <ProgressCircle percentage={completionRate} size={50} strokeWidth={5} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{totalLoggedHours} <span className="text-sm text-muted-foreground">/ {totalEstimatedHours}</span></div>
            <p className="text-xs text-muted-foreground">
              Hours of work completed
            </p>
          </div>
          <ProgressCircle percentage={hoursProgress} size={50} strokeWidth={5} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flagged Tasks</CardTitle>
          <Flag className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{flaggedTasks}</div>
          <p className="text-xs text-muted-foreground">
            Tasks requiring attention
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blocked Tasks</CardTitle>
          <FileWarning className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{blockedTasks}</div>
          <p className="text-xs text-muted-foreground">
            Tasks with impediments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On-Track Projects</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length - (blockedTasks > 0 ? 1 : 0)}</div>
          <p className="text-xs text-muted-foreground">
            Projects progressing as planned
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
