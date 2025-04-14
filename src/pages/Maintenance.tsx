
import { AppShell } from "@/components/layout/AppShell";
import { MaintenanceFeed } from "@/components/maintenance/MaintenanceFeed";

const Maintenance = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Maintenance Feed</h2>
          <p className="text-muted-foreground">
            Track engine status, servicing progress, and ESN history
          </p>
        </div>
        
        <MaintenanceFeed />
      </div>
    </AppShell>
  );
};

export default Maintenance;
