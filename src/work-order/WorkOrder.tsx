import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChevronRight } from "lucide-react";
import Timeline from "@/work-order/timeline/Timeline";

const WorkOrder = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-in">
        <div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Link
              to="/daily-plan"
              className="hover:text-primary transition-colors"
            >
              Daily Plan
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Work Order {workOrderId}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Work Order {workOrderId}
          </h2>
          <p className="text-muted-foreground">Work in progress</p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <Timeline />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default WorkOrder;
