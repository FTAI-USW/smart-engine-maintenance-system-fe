
import { AppShell } from "@/components/layout/AppShell";
import { TimeTracking as TimeTrackingComponent } from "@/components/time-tracking/TimeTracking";

const TimeTracking = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Time Tracking</h2>
          <p className="text-muted-foreground">
            Log hours spent on tasks and track work progress
          </p>
        </div>
        
        <TimeTrackingComponent />
      </div>
    </AppShell>
  );
};

export default TimeTracking;
