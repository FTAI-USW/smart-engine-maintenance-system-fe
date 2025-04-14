
import { useAuth } from "@/contexts/AuthContext";
import { getNotificationsByUser, markNotificationAsRead, deleteNotification } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Flag, RotateCcw, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NotificationCenter() {
  const { currentUser } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  if (!currentUser) return null;
  
  const notifications = getNotificationsByUser(currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center">
        <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No notifications</p>
      </div>
    );
  }
  
  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleDelete = (id: string) => {
    deleteNotification(id);
    setRefreshTrigger(prev => prev + 1);
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case "flag":
        return <Flag className="h-4 w-4 text-red-500" />;
      case "status":
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      case "assignment":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "progress":
        return <RotateCcw className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="p-2">
      <div className="flex items-center justify-between p-2">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            notifications
              .filter(n => !n.isRead)
              .forEach(n => markNotificationAsRead(n.id));
            setRefreshTrigger(prev => prev + 1);
          }}
          className="text-xs"
        >
          Mark all as read
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-3 mb-1 rounded-md ${notification.isRead ? 'bg-background' : 'bg-accent'} border border-border flex`}
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              {!notification.isRead && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleMarkAsRead(notification.id)} 
                  className="h-6 w-6"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(notification.id)} 
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
