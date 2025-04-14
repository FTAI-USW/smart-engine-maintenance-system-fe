
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types";
import { getUserById } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskActivityProps {
  tasks: Task[];
}

export function TaskActivity({ tasks }: TaskActivityProps) {
  // Sort tasks by updated date, most recent first
  const sortedTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10); // Only show the 10 most recent
  
  if (sortedTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent task activity</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {sortedTasks.map(task => {
              const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;
              
              return (
                <div key={task.id} className="flex items-start space-x-4">
                  {assignee ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{task.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {task.priority}
                      </Badge>
                      {task.isFlagged && (
                        <Badge variant="destructive" className="text-xs">
                          Flagged
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description || "No description"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
