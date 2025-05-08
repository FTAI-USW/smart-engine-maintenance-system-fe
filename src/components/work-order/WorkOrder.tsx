import { useParams, Link, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChevronRight } from "lucide-react";
import Timeline from "@/components/work-order/timeline/Timeline";
import TimelineSidePanel from "./timeline/TimelineSidePanel";
import type { Task } from "./timeline/TimelineSidePanel";
import { useState } from "react";

const HEADER_OFFSET = 180;

const WorkOrder = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const location = useLocation();
  const assignees = location.state?.assignees || [];
  const availableHeight = window.innerHeight - HEADER_OFFSET;
  const [sidePanelTech, setSidePanelTech] = useState<string | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);

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
          }}
        >
          <Timeline
            maxHeight="50%"
            workOrderId={workOrderId || ""}
            onBarClick={setSidePanelTech}
            setAllTasks={setAllTasks}
            assignees={assignees}
          />
        </div>
        {sidePanelTech && (
          <TimelineSidePanel
            technicianName={sidePanelTech}
            tasks={allTasks.filter((t) => t.name === sidePanelTech)}
            workOrderId={workOrderId || ""}
            onClose={() => setSidePanelTech(null)}
          />
        )}
      </div>
    </AppShell>
  );
};

export default WorkOrder;
