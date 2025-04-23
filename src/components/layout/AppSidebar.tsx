import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Kanban,
  ClipboardList,
  Users,
  Clock,
  Gauge,
  Bell,
  SlidersHorizontal,
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const isSupervisor = currentUser.role === "supervisor";

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
      show: true,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: Kanban,
      active: location.pathname.startsWith("/projects"),
      show: true,
    },
    {
      name: "My Tasks",
      href: "/my-tasks",
      icon: ClipboardList,
      active: location.pathname === "/my-tasks",
      show: true,
    },
    {
      name: "Filter & Controls",
      href: "/filter-controls",
      icon: SlidersHorizontal,
      active: location.pathname === "/filter-controls",
      show: true,
    },
    {
      name: "Time Tracking",
      href: "/time-tracking",
      icon: Clock,
      active: location.pathname === "/time-tracking",
      show: true,
    },
    {
      name: "Maintenance Feed",
      href: "/maintenance",
      icon: Gauge,
      active: location.pathname === "/maintenance",
      show: true,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      active: location.pathname === "/notifications",
      show: true,
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      active: location.pathname === "/users",
      show: isAdmin,
    },
    // {
    //   name: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    //   active: location.pathname === "/settings",
    //   show: true,
    // },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
        <h2 className="text-xl font-bold text-white">
          Smart Engine Maintenance System
        </h2>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={
                currentUser.avatar || "https://i.pravatar.cc/150?img=default"
              }
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {currentUser.role}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
        </nav>
      </div>
    </div>
  );
}
