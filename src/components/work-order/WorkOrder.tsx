import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChevronRight } from "lucide-react";
import Timeline from "@/components/work-order/timeline/Timeline";

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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
            height: "100%",
            overflowX: "auto",
          }}
        >
          <Timeline maxHeight="100%" />
        </div>
      </div>
    </AppShell>
  );
};

export default WorkOrder;
