import { AppShell } from "@/components/layout/AppShell";
import { UserManagement } from "@/components/users/UserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Users = () => {
  const { currentUser } = useAuth();

  // Only admin and supervisor can access this page
  if (currentUser && currentUser.role === "technician") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>

        <UserManagement />
      </div>
    </AppShell>
  );
};

export default Users;
