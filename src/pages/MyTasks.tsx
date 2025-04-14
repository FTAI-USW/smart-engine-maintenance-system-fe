import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getTasksForUser, updateTask } from "@/lib/storage";
import { Task } from "@/types";
import { TaskCard } from "@/components/projects/TaskCard";
import { TaskDetail } from "@/components/projects/TaskDetail";
import { Badge } from "@/components/ui/badge";
import { Clock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const MyTasks = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  useEffect(() => {
    if (currentUser) {
      const userTasks = getTasksForUser(currentUser.id);
      setTasks(userTasks);
      setFilteredTasks(userTasks);
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (!tasks.length) return;
    
    let filtered = [...tasks];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        (task.esn && task.esn.toLowerCase().includes(query))
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter]);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    updateTask(updatedTask);
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setSelectedTask(null);
    
    toast({
      title: "Task updated",
      description: `${updatedTask.title} has been updated.`
    });
  };
  
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };
  
  const metrics = {
    total: filteredTasks.length,
    inProgress: getTasksByStatus("in_progress").length,
    completed: getTasksByStatus("done").length,
    blocked: getTasksByStatus("blocked").length,
  };
  
  return (
    <AppShell>
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
            <p className="text-muted-foreground">
              View and manage your assigned tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="text-sm text-muted-foreground">All Tasks</div>
              <div className="text-2xl font-bold">{metrics.total}</div>
            </div>
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold">{metrics.inProgress}</div>
            </div>
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold">{metrics.completed}</div>
            </div>
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="text-sm text-muted-foreground">Blocked</div>
              <div className="text-2xl font-bold">{metrics.blocked}</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchQuery(""); 
                setStatusFilter("all"); 
                setPriorityFilter("all"); 
              }}
            >
              Reset Filters
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              <TabsTrigger value="reported">Reported by Me</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {filteredTasks.map((task) => (
                    <div key={task.id} onClick={() => handleTaskClick(task)}>
                      <TaskCard task={task} onClick={handleTaskClick} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="assigned" className="space-y-4">
              {filteredTasks.filter(t => t.assigneeId === currentUser?.id).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks assigned to you</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {filteredTasks
                    .filter(t => t.assigneeId === currentUser?.id)
                    .map((task) => (
                      <div key={task.id} onClick={() => handleTaskClick(task)}>
                        <TaskCard task={task} onClick={handleTaskClick} />
                      </div>
                    ))
                  }
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reported" className="space-y-4">
              {filteredTasks.filter(t => t.reporterId === currentUser?.id).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks reported by you</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {filteredTasks
                    .filter(t => t.reporterId === currentUser?.id)
                    .map((task) => (
                      <div key={task.id} onClick={() => handleTaskClick(task)}>
                        <TaskCard task={task} onClick={handleTaskClick} />
                      </div>
                    ))
                  }
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="flagged" className="space-y-4">
              {filteredTasks.filter(t => t.isFlagged).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No flagged tasks</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {filteredTasks
                    .filter(t => t.isFlagged)
                    .map((task) => (
                      <div key={task.id} onClick={() => handleTaskClick(task)}>
                        <TaskCard task={task} onClick={handleTaskClick} />
                        
                        {task.dueDate && new Date(task.dueDate) < new Date() && (
                          <Badge 
                            variant="outline"
                            className="bg-red-100 text-red-800 mt-2 ml-1 flex w-fit items-center"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {selectedTask && (
            <TaskDetail 
              task={selectedTask} 
              onClose={() => setSelectedTask(null)} 
              onUpdate={handleTaskUpdate}
            />
          )}
        </div>
      </DndProvider>
    </AppShell>
  );
};

export default MyTasks;
