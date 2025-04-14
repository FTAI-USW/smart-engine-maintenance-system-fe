import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getUsers } from "@/lib/storage";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const { currentUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const users = getUsers();

  // Handle user switching (only in demo mode)
  const handleSwitchUser = (userId: string) => {
    login(userId);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => navigate("/settings")}>
          <UserCog className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />

        {/* Demo mode user switching */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch User (Demo)
        </DropdownMenuLabel>
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => handleSwitchUser(user.id)}
            disabled={user.id === currentUser.id}
          >
            <div className="flex items-center space-x-2 w-full">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs capitalize">
                {user.role}: {user.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
