import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWorkOrders, WorkOrder } from "@/services/workOrderService";

const columns = [
  { key: "WORK_ORDER", label: "Work Order" },
  { key: "OFF_ESN", label: "Off Engine Serial" },
  { key: "FOR_ESN", label: "For Engine Serial" },
  { key: "TASK_DESC", label: "Description" },
  { key: "TASK_STATUS", label: "Status" },
  { key: "EMPLOYEE_NAME", label: "Assignee" },
  { key: "TOLL_GATE", label: "Supervisor Notes" },
  { key: "WORK_CENTER", label: "Work Center" },
  { key: "HOURS_WORKED", label: "Hours Clocked" },
  { key: "SEQUENCE", label: "Sequence" },
];

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("SEQUENCE");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalTask, setModalTask] = useState<Record<string, any> | null>(null);

  // Example last updated date (could be dynamic in the future)
  const lastUpdated = new Date().toLocaleString();

  useEffect(() => {
    setLoading(true);
    fetchWorkOrders({
      page: 1,
      pageSize: 10,
      "work_order[gte]": "WEN101008",
      "work_order[like]": "WEN%",
      "off_esn[notnull]": "",
      "for_esn[notnull]": "",
      "toll_gate[notnull]": "",
      "hours_worked[notnull]": "",
    } as any)
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load work orders"))
      .finally(() => setLoading(false));
  }, []);

  // Sorting logic
  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (order: any) => {
    navigate(`/work-order/${order.WORK_ORDER}`);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-destructive">{error}</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
          <p className="text-muted-foreground">Work in progress</p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated}
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-brand-navy text-white font-semibold border-b border-brand-blue">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={
                        "cursor-pointer select-none transition-colors bg-brand-navy text-white hover:bg-brand-navy60 " +
                        (sortBy === col.key
                          ? "underline decoration-brand-orange decoration-2"
                          : "")
                      }
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortBy === col.key
                        ? sortOrder === "asc"
                          ? " ▲"
                          : " ▼"
                        : null}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order, idx) => (
                  <TableRow
                    key={order.WORK_ORDER + idx}
                    className="hover:bg-brand-blue/10 cursor-pointer transition-colors border-b border-brand-blue"
                    onClick={() => handleRowClick(order)}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {order[col.key] ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Modal for row details (optional, can be adapted for WorkOrder) */}
            {modalTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <button
                    className="absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setModalTask(null)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-4">Order Details</h3>
                  <div className="space-y-2">
                    {modalTask &&
                      Object.entries(modalTask).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-semibold capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>
                          {String(value)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default MyOrders;
