import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MyTasks from "./pages/MyTasks";
import Users from "./pages/Users";
import TimeTracking from "./pages/TimeTracking";
import Maintenance from "./pages/Maintenance";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import FilterControls from "./pages/FilterControls";
import MyOrders from "./pages/MyOrders";
import WorkOrder from "@/components/work-order/WorkOrder";
import Snags from "./components/Snags";

// Create query client
const queryClient = new QueryClient();

// AuthGuard component to protect routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/projects"
              element={
                <AuthGuard>
                  <Projects />
                </AuthGuard>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <AuthGuard>
                  <ProjectDetail />
                </AuthGuard>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <AuthGuard>
                  <MyTasks />
                </AuthGuard>
              }
            />
            <Route
              path="/filter-controls"
              element={
                <AuthGuard>
                  <FilterControls />
                </AuthGuard>
              }
            />
            <Route
              path="/users"
              element={
                <AuthGuard>
                  <Users />
                </AuthGuard>
              }
            />
            <Route
              path="/time-tracking"
              element={
                <AuthGuard>
                  <TimeTracking />
                </AuthGuard>
              }
            />
            <Route
              path="/maintenance"
              element={
                <AuthGuard>
                  <Maintenance />
                </AuthGuard>
              }
            />
            <Route
              path="/notifications"
              element={
                <AuthGuard>
                  <Notifications />
                </AuthGuard>
              }
            />
            <Route
              path="/my-orders"
              element={
                <AuthGuard>
                  <MyOrders />
                </AuthGuard>
              }
            />
            <Route
              path="/snags"
              element={
                <AuthGuard>
                  <Snags />
                </AuthGuard>
              }
            />
            <Route
              path="/work-order/:workOrderId"
              element={
                <AuthGuard>
                  <WorkOrder />
                </AuthGuard>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster />
        <Sonner />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
