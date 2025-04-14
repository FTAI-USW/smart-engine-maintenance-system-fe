
import { useState, useCallback } from "react";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { TaskDetail } from "./TaskDetail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { updateTask } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onTaskDrop: (taskId: string, status: TaskStatus) => void;
}

// Column component that handles drop events
function KanbanColumn({ title, status, tasks, onTaskClick, onAddTask, onTaskDrop }: KanbanColumnProps) {
  // Configure drop target with proper handling
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string, status: TaskStatus }) => {
      console.log("Dropping task:", item.id, "from", item.status, "to", status);
      onTaskDrop(item.id, status);
      return { status };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  
  return (
    <div 
      ref={drop} 
      className={`kanban-column ${isOver ? "bg-accent/50" : ""}`}
      style={{ minHeight: "200px" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{title}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onAddTask(status)}
          className="h-6 w-6"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskCreate: (status: TaskStatus) => void;
}

export function KanbanBoard({ projectId, tasks, onTaskUpdate, onTaskCreate }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  
  // Handle task click to open detail view
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);
  
  // Handle closing task detail modal
  const handleCloseTask = useCallback(() => {
    setSelectedTask(null);
  }, []);
  
  // Handle task updates
  const handleTaskUpdate = useCallback((task: Task) => {
    onTaskUpdate(task);
    setSelectedTask(null);
  }, [onTaskUpdate]);
  
  // Enhanced task drop handler with better debugging
  const handleTaskDrop = useCallback((taskId: string, newStatus: TaskStatus) => {
    console.log("Handling task drop:", taskId, "to", newStatus);
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
      console.log("Updating task status:", task.title, "from", task.status, "to", newStatus);
      const updatedTask = { ...task, status: newStatus };
      
      // Update in storage
      updateTask(updatedTask);
      
      // Update in parent component
      onTaskUpdate(updatedTask);
      
      // Show toast notification
      toast({
        title: "Task status updated",
        description: `"${task.title}" moved to ${newStatus.replace("_", " ")}`,
      });
    } else {
      console.log("Task not found or status unchanged");
    }
  }, [tasks, onTaskUpdate, toast]);
  
  // Filter tasks by status
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <KanbanColumn 
            title="Backlog" 
            status="backlog" 
            tasks={getTasksByStatus("backlog")} 
            onTaskClick={handleTaskClick} 
            onAddTask={onTaskCreate}
            onTaskDrop={handleTaskDrop}
          />
          <KanbanColumn 
            title="To Do" 
            status="todo" 
            tasks={getTasksByStatus("todo")} 
            onTaskClick={handleTaskClick} 
            onAddTask={onTaskCreate}
            onTaskDrop={handleTaskDrop}
          />
          <KanbanColumn 
            title="In Progress" 
            status="in_progress" 
            tasks={getTasksByStatus("in_progress")} 
            onTaskClick={handleTaskClick} 
            onAddTask={onTaskCreate}
            onTaskDrop={handleTaskDrop}
          />
          <KanbanColumn 
            title="Blocked" 
            status="blocked" 
            tasks={getTasksByStatus("blocked")} 
            onTaskClick={handleTaskClick} 
            onAddTask={onTaskCreate}
            onTaskDrop={handleTaskDrop}
          />
          <KanbanColumn 
            title="Done" 
            status="done" 
            tasks={getTasksByStatus("done")} 
            onTaskClick={handleTaskClick} 
            onAddTask={onTaskCreate}
            onTaskDrop={handleTaskDrop}
          />
        </div>
        
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onClose={handleCloseTask} 
            onUpdate={handleTaskUpdate}
          />
        )}
      </div>
    </DndProvider>
  );
}
