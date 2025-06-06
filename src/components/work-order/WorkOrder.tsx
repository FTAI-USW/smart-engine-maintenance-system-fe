import { useParams, Link, useLocation } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChevronRight } from "lucide-react";
import Timeline from "@/components/work-order/timeline/Timeline";
import TimelineSidePanel from "./timeline/TimelineSidePanel";
import type { Task } from "./timeline/TimelineSidePanel";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { WorkOrder } from "@/services/workOrderService";

const HEADER_OFFSET = 180;

const WorkOrder = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const location = useLocation();
  const assignees = location.state?.assignees || [];
  const availableHeight = window.innerHeight - HEADER_OFFSET;
  const [sidePanelTech, setSidePanelTech] = useState<string | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  // Use workOrder from navigation state
  const workOrder = location.state?.workOrder as WorkOrder | undefined;

  if (!workOrder) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-destructive">No work order data provided.</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-in">
        <div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Link
              to="/my-orders"
              className="hover:text-primary transition-colors"
            >
              My Orders
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Work Order {workOrderId}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Work Order {workOrder.workOrder}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={
                workOrder.taskStatus === "Completed" ? "secondary" : "default"
              }
            >
              {workOrder.taskStatus}
            </Badge>
            <span className="text-muted-foreground">
              Created{" "}
              {workOrder.createdDate &&
                format(new Date(workOrder.createdDate), "PPP")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Engine Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">ESN ID</dt>
                  <dd className="font-medium">{workOrder.esnId}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Off Engine Serial
                  </dt>
                  <dd className="font-medium">{workOrder.offEngineSerial}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    For Engine Serial
                  </dt>
                  <dd className="font-medium">{workOrder.forEngineSerial}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Module</dt>
                  <dd className="font-medium">{workOrder.taskModule}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Sequence</dt>
                  <dd className="font-medium">{workOrder.sequence}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Estimated Hours
                  </dt>
                  <dd className="font-medium">{workOrder.estimatedHours}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Labor Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Hours Worked
                  </dt>
                  <dd className="font-medium">{workOrder.hoursWorked || 0}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Clock In</dt>
                  <dd className="font-medium">
                    {workOrder.clockIn &&
                      format(new Date(workOrder.clockIn), "PPp")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Clock Off</dt>
                  <dd className="font-medium">
                    {workOrder.clockOff &&
                      format(new Date(workOrder.clockOff), "PPp")}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div style={{ width: "100%" }}>
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
