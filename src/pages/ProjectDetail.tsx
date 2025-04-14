
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { NewTaskForm } from "@/components/projects/NewTaskForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  getProjectById, 
  getTasksByProject, 
  updateTask,
  getUserById
} from "@/lib/storage";
import { Project, Task, TaskStatus } from "@/types";
import { ArrowLeft, ChevronRight, Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  
  // Load project and tasks
  useEffect(() => {
    if (!projectId) return;
    
    const projectData = getProjectById(projectId);
    if (projectData) {
      setProject(projectData);
      setTasks(getTasksByProject(projectId));
    }
  }, [projectId]);
  
  // Handle task update
  const handleTaskUpdate = (updatedTask: Task) => {
    try {
      updateTask(updatedTask);
      
      // Update local state
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      
      toast({
        title: "Task updated",
        description: `"${updatedTask.title}" has been updated.`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive"
      });
    }
  };
  
  // Handle new task creation
  const handleCreateTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    setIsCreateTaskOpen(true);
  };
  
  // Handle task created
  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task created",
      description: `"${newTask.title}" has been created.`,
    });
  };
  
  if (!project || !currentUser) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-64">
          <p>Project not found or loading...</p>
        </div>
      </AppShell>
    );
  }
  
  // Determine if user can create tasks
  const canCreateTasks = currentUser.role === "admin" || currentUser.role === "supervisor";
  
  // Get project owner
  const owner = getUserById(project.ownerId);
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/projects" className="hover:text-foreground transition-colors">
            Projects
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{project.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
            <p className="text-muted-foreground">
              {project.description}
            </p>
          </div>
          
          {canCreateTasks && (
            <Button onClick={() => handleCreateTask("todo")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Team Members: {project.members.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Owner:</span>
            {owner && (
              <div className="flex items-center space-x-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={owner.avatar} alt={owner.name} />
                  <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{owner.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <KanbanBoard
          projectId={project.id}
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleCreateTask}
        />
      </div>
      
      {isCreateTaskOpen && (
        <NewTaskForm
          projectId={project.id}
          initialStatus={newTaskStatus}
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </AppShell>
  );
};

export default ProjectDetail;
