
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { getNotificationsByUser, markNotificationAsRead, deleteNotification } from "@/lib/storage";
import { Notification } from "@/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Flag, RotateCcw, Trash2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Load notifications
  useEffect(() => {
    if (!currentUser) return;
    
    const userNotifications = getNotificationsByUser(currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setNotifications(userNotifications);
  }, [currentUser, refreshTrigger]);
  
  // Handle mark as read
  const handleMarkAsRead = (id: string) => {
    try {
      markNotificationAsRead(id);
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "Notification marked as read",
        description: "Notification has been marked as read."
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive"
      });
    }
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    try {
      notifications
        .filter(n => !n.isRead)
        .forEach(n => markNotificationAsRead(n.id));
      
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "All notifications marked as read",
        description: "All notifications have been marked as read."
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive"
      });
    }
  };
  
  // Handle delete notification
  const handleDelete = (id: string) => {
    try {
      deleteNotification(id);
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "Notification deleted",
        description: "Notification has been deleted."
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive"
      });
    }
  };
  
  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "flag":
        return <Flag className="h-5 w-5 text-red-500" />;
      case "status":
        return <RotateCcw className="h-5 w-5 text-blue-500" />;
      case "assignment":
        return <UserCheck className="h-5 w-5 text-green-500" />;
      case "progress":
        return <RotateCcw className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">
              Stay updated on task assignments, flags, and status changes
            </p>
          </div>
          
          {notifications.some(n => !n.isRead) && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Center</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border flex items-start ${
                      notification.isRead ? 'bg-background' : 'bg-accent/50'
                    }`}
                  >
                    <div className="mr-4 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex ml-4 space-x-2">
                      {!notification.isRead && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Notifications;
