
import { Task } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/lib/storage";
import { AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useDrag } from "react-dnd";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;
  
  // Configure drag functionality - include the full task in the item
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  
  // Format status for display
  const getStatusClass = () => {
    switch (task.status) {
      case "backlog":
        return "task-status-todo";
      case "todo":
        return "task-status-todo";
      case "in_progress":
        return "task-status-inprogress";
      case "review":
        return "task-status-inprogress";
      case "blocked":
        return "task-status-blocked";
      case "done":
        return "task-status-done";
      default:
        return "task-status-todo";
    }
  };
  
  // Format priority for display
  const getPriorityClass = () => {
    switch (task.priority) {
      case "low":
        return "task-priority-low";
      case "medium":
        return "task-priority-medium";
      case "high":
        return "task-priority-high";
      case "critical":
        return "task-priority-critical";
      default:
        return "task-priority-medium";
    }
  };
  
  // Format time remaining
  const getTimeRemaining = () => {
    const totalEstimated = task.estimatedHours;
    const logged = task.loggedHours;
    return totalEstimated - logged;
  };
  
  return (
    <div 
      ref={drag} 
      className="task-card cursor-grab bg-card rounded-md border p-3 shadow-sm"
      onClick={() => onClick(task)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className={getStatusClass()}>
              {task.status.replace("_", " ")}
            </span>
            <span className={getPriorityClass()}>
              {task.priority}
            </span>
          </div>
          
          {task.isFlagged && (
            <span className="text-red-500">
              <AlertTriangle size={16} />
            </span>
          )}
        </div>
        
        <h3 className="font-medium">{task.title}</h3>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Due {format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              {getTimeRemaining()}h left
            </span>
          </div>
          
          {assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Badge variant="outline" className="text-xs">Unassigned</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
