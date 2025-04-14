
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { getTasks, getProjectById } from "@/lib/storage";
import { Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MaintenanceFeed() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load all tasks that have an ESN
  useEffect(() => {
    const tasks = getTasks().filter(task => !!task.esn);
    setAllTasks(tasks);
    setFilteredTasks(tasks);
  }, []);
  
  // Filter tasks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(allTasks);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = allTasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (task.esn && task.esn.toLowerCase().includes(query))
    );
    
    setFilteredTasks(filtered);
  }, [searchQuery, allTasks]);
  
  // Group tasks by ESN
  const tasksByESN = filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!task.esn) return acc;
    
    if (!acc[task.esn]) {
      acc[task.esn] = [];
    }
    
    acc[task.esn].push(task);
    return acc;
  }, {});
  
  // Calculate progress for each ESN
  const getEngineProgress = (tasks: Task[]) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "done").length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };
  
  // Determine engine status
  const getEngineStatus = (tasks: Task[]) => {
    const hasFlagged = tasks.some(task => task.isFlagged);
    const hasBlocked = tasks.some(task => task.status === "blocked");
    
    if (hasBlocked) return "blocked";
    if (hasFlagged) return "at_risk";
    
    const progress = getEngineProgress(tasks);
    if (progress === 100) return "completed";
    
    return "on_track";
  };
  
  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "on_track":
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case "at_risk":
        return <Badge className="bg-yellow-100 text-yellow-800">At Risk</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  
  // Get the estimated completion date (latest due date of any task)
  const getCompletionDate = (tasks: Task[]) => {
    const dueDates = tasks
      .filter(task => task.dueDate)
      .map(task => new Date(task.dueDate as string))
      .sort((a, b) => b.getTime() - a.getTime());
    
    return dueDates.length > 0 ? dueDates[0] : null;
  };
  
  // Get the project name
  const getProjectName = (projectId: string) => {
    const project = getProjectById(projectId);
    return project ? project.name : "Unknown Project";
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Maintenance Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ESN or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ESN</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Expected Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(tasksByESN).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No maintenance records found
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(tasksByESN).map(([esn, tasks]) => {
                  const progress = getEngineProgress(tasks);
                  const status = getEngineStatus(tasks);
                  const completionDate = getCompletionDate(tasks);
                  const projectName = getProjectName(tasks[0].projectId);
                  
                  return (
                    <TableRow key={esn}>
                      <TableCell className="font-medium">{esn}</TableCell>
                      <TableCell>{projectName}</TableCell>
                      <TableCell>{formatStatus(status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={progress} className="w-[80px]" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tasks.length} ({tasks.filter(t => t.status === "done").length} completed)
                      </TableCell>
                      <TableCell>
                        {completionDate 
                          ? formatDistanceToNow(completionDate, { addSuffix: true })
                          : "Not scheduled"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
