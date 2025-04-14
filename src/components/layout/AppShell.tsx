
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { UserNav } from "./UserNav";
import { NotificationCenter } from "./NotificationCenter";
import { 
  Bell, 
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getNotificationsByUser, 
  markNotificationAsRead 
} from "@/lib/storage";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Count unread notifications
  const notifications = currentUser 
    ? getNotificationsByUser(currentUser.id) 
    : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    
    // Mark all as read when opening
    if (!notificationsOpen && unreadCount > 0) {
      notifications
        .filter(n => !n.isRead)
        .forEach(n => markNotificationAsRead(n.id));
    }
  };

  if (!currentUser) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="lg:hidden mr-2"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-xl font-bold">Engine Task Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleNotifications}
                className="relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-50">
                  <NotificationCenter />
                </div>
              )}
            </div>
            <UserNav />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
