
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getTasks, getProjectById, getUserById, updateTask } from "@/lib/storage";
import { Task, User } from "@/types";
import { format } from "date-fns";
import { Clock, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function TimeTracking() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loggedHours, setLoggedHours] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  
  // Load tasks for the current user
  useEffect(() => {
    if (!currentUser) return;
    
    let userTasks: Task[];
    if (currentUser.role === "technician") {
      // For technicians, show only their assigned tasks
      userTasks = getTasks().filter(task => task.assigneeId === currentUser.id);
    } else {
      // For supervisors and admins, show all tasks
      userTasks = getTasks();
    }
    
    setTasks(userTasks);
    
    // Initialize logged hours from tasks
    const initialLoggedHours: Record<string, number> = {};
    userTasks.forEach(task => {
      initialLoggedHours[task.id] = task.loggedHours;
    });
    setLoggedHours(initialLoggedHours);
  }, [currentUser]);
  
  // Handle logged hours input change
  const handleHoursChange = (taskId: string, hours: number) => {
    setLoggedHours(prev => ({
      ...prev,
      [taskId]: hours
    }));
  };
  
  // Handle save logged hours
  const handleSave = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setLoading(true);
    try {
      const updatedTask = {
        ...task,
        loggedHours: loggedHours[taskId]
      };
      
      updateTask(updatedTask);
      
      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId ? updatedTask : t
      ));
      
      toast({
        title: "Time logged",
        description: `Updated logged hours for "${task.title}"`,
      });
    } catch (error) {
      console.error("Error updating logged hours:", error);
      toast({
        title: "Error",
        description: "Failed to update logged hours",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get user name by id
  const getUserName = (userId?: string) => {
    if (!userId) return "Unassigned";
    const user = getUserById(userId);
    return user ? user.name : "Unknown";
  };
  
  // Get project name by id
  const getProjectName = (projectId: string) => {
    const project = getProjectById(projectId);
    return project ? project.name : "Unknown";
  };
  
  // Calculate progress
  const calculateProgress = (logged: number, estimated: number) => {
    if (estimated <= 0) return 0;
    const progress = (logged / estimated) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Estimated Hours</TableHead>
                <TableHead>Logged Hours</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map(task => {
                  const progress = calculateProgress(
                    loggedHours[task.id] || 0, 
                    task.estimatedHours
                  );
                  
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {task.dueDate && (
                              <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getProjectName(task.projectId)}</TableCell>
                      <TableCell>{getUserName(task.assigneeId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={progress} className="w-[80px]" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{task.estimatedHours}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={loggedHours[task.id] || 0}
                          onChange={(e) => handleHoursChange(task.id, parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSave(task.id)}
                          disabled={loading || loggedHours[task.id] === task.loggedHours}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
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
