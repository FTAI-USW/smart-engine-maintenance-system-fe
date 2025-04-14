import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ChevronDown, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getTasks, getUsers } from "@/lib/storage";
import { Task, User } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type DateRange = {
  from: Date;
  to?: Date;
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Sun"];
const workers = ["John", "Sarah", "Mike", "Anna"];
const engineESNs = ["ESN-123", "ESN-456", "ESN-789"];
const taskStatuses = ["Pending", "In Progress", "Done", "Blocked"];

const FilterControls = () => {
  // States for filters
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  // State for the task detail modal
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Get all tasks
  const tasks = getTasks();
  const users = getUsers();
  
  // Mock data for grid display
  const gridTasks = [
    { id: "1", name: "Inspect Engine", engineEsn: "ESN-123", status: "Pending", assignedTo: "John", day: "Sun" },
    { id: "2", name: "Replace Part X", engineEsn: "ESN-123", status: "In Progress", assignedTo: "Sarah", day: "Tue" },
    { id: "3", name: "Maintenance Check", engineEsn: "ESN-123", status: "Done", assignedTo: "Mike", day: "Sun" },
    { id: "4", name: "Oil Change", engineEsn: "ESN-123", status: "Pending", assignedTo: "Anna", day: "Sun" },
  ];
  
  // Mock data for metrics
  const metrics = {
    tasksAssigned: 5,
    tasksCompleted: 3,
    delaysReported: 3,
    avgCompletionTime: "4.5 hours"
  };
  
  // Handler for opening task detail
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Filter & Controls Panel</h2>
          <div className="text-lg">{format(new Date(), "MMMM d, yyyy")}</div>
          <Button variant="outline">Auto Assign</Button>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Filter & Controls Panel</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Date Range Picker</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range) {
                    setDateRange({
                      from: range.from || new Date(),
                      to: range.to
                    });
                  }
                }}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Filter by Engine ESN */}
          <Select value={selectedEngine} onValueChange={setSelectedEngine}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Engine ESN" />
            </SelectTrigger>
            <SelectContent>
              {engineESNs.map((esn) => (
                <SelectItem key={esn} value={esn}>
                  {esn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Filter by Worker */}
          <Select value={selectedWorker} onValueChange={setSelectedWorker}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Worker" />
            </SelectTrigger>
            <SelectContent>
              {workers.map((worker) => (
                <SelectItem key={worker} value={worker}>
                  {worker}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Status */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {taskStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View (Weekly Grid)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  {/* Grid Header */}
                  <div className="grid grid-cols-5 border-b">
                    <div className="p-2 text-sm font-medium border-r">Worker</div>
                    {daysOfWeek.map((day) => (
                      <div key={day} className="p-2 text-sm font-medium border-r">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid Body */}
                  {workers.map((worker) => (
                    <div key={worker} className="grid grid-cols-5 border-b">
                      <div className="p-2 text-sm border-r">{worker}</div>
                      {daysOfWeek.map((day) => {
                        const tasksForCell = gridTasks.filter(
                          (task) => task.assignedTo === worker && task.day === day
                        );
                        return (
                          <div key={day} className="p-1 border-r min-h-[50px]">
                            {tasksForCell.map((task) => (
                              <div 
                                key={task.id}
                                className={cn(
                                  "p-1 mb-1 rounded border cursor-pointer text-xs",
                                  task.status === "Pending" && "bg-gray-100",
                                  task.status === "In Progress" && "bg-blue-100",
                                  task.status === "Done" && "bg-green-100",
                                  task.status === "Blocked" && "bg-red-100"
                                )}
                                onClick={() => handleTaskClick(task)}
                              >
                                <div className="font-medium truncate">{task.status}</div>
                                <div className="text-xs text-gray-600 truncate">{task.engineEsn}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Task Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left">Task Name</th>
                        <th className="p-3 text-left">ESN</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridTasks.map((task) => (
                        <tr key={task.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleTaskClick(task)}>
                          <td className="p-3">{task.name}</td>
                          <td className="p-3">{task.engineEsn}</td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-1 rounded text-sm",
                              task.status === "Pending" && "bg-gray-200",
                              task.status === "In Progress" && "bg-blue-200",
                              task.status === "Done" && "bg-green-200",
                              task.status === "Blocked" && "bg-red-200"
                            )}>
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Daily Metrics Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tasks Assigned Today</span>
                  <span className="font-semibold">{metrics.tasksAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasks Completed</span>
                  <span className="font-semibold">{metrics.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delays Reported</span>
                  <span className="font-semibold">{metrics.delaysReported}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Completion Time</span>
                  <span className="font-semibold">{metrics.avgCompletionTime}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Team Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Workers</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Available</span>
                    <span>50%</span>
                  </div>
                  <Progress value={50} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Hours</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Detail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task</label>
              <Input value={selectedTask?.name || ""} readOnly />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Select defaultValue={selectedTask?.assignedTo || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker} value={worker}>
                      {worker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="text" placeholder="01/2023" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="text" placeholder="Select date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Engine ESN</label>
              <Select defaultValue={selectedTask?.engineEsn || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  {engineESNs.map((esn) => (
                    <SelectItem key={esn} value={esn}>
                      {esn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue={selectedTask?.status || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="workStoppage" />
              <label htmlFor="workStoppage" className="text-sm font-medium">Work Stoppage</label>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated vs actual hours</label>
              <Input type="text" placeholder="Hours" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full sm:w-auto">Save</Button>
            <Button className="w-full sm:w-auto">Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default FilterControls;
