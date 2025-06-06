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
  { key: "TASK_STATUS", label: "Status" },
  { key: "EMPLOYEE_NAME", label: "Assignee" },
  { key: "TOLL_GATE", label: "Toll Gate" },
  { key: "WORK_CENTER", label: "Work Center" },
  // Action button column will be added at render time
];

const getStatusColor = (status: string) => {
  // Green - Completed/Closed statuses
  const greenStatuses = [
    "CLOSED",
    "PERMANENT CLOSE",
    "SIGNED OFF",
    "PART SCRAPPED",
    "PART US",
    "PICKED UP",
  ];

  // Red - On Hold statuses
  const redStatuses = [
    "ON-HOLD-CMR",
    "ON-HOLD-ENG",
    "ON-HOLD-EQUIP",
    "ON-HOLD-ESR",
    "ON-HOLD-LAB",
    "ON-HOLD-MATL",
    "ON-HOLD-MRB",
    "ON-HOLD-PLNG",
    "ON-HOLD-QTN",
    "ON-HOLD-QUOTE",
    "ON-HOLD-RCDS",
    "ON-HOLD-SNAG",
    "ON-HOLD-TOOL",
    "ON-HOLD-UPGRADE",
    "ON-HOLD-WCD",
    "CANCELED",
    "TASK REJECT",
    "WO DOWNGRADE",
    "WO UPGRADE",
  ];

  if (greenStatuses.includes(status)) {
    return "bg-green-500 text-white";
  } else if (redStatuses.includes(status)) {
    return "bg-red-500 text-white";
  } else {
    // Yellow - In Progress statuses
    return "bg-yellow-500 text-white";
  }
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("SEQUENCE");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalTask, setModalTask] = useState<WorkOrder | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Example last updated date (could be dynamic in the future)
  const lastUpdated = new Date().toLocaleString();

  useEffect(() => {
    setLoading(true);
    fetchWorkOrders({
      page,
      pageSize: 10,
      "work_order[gte]": "WEN101008",
      "work_order[like]": "WEN%",
      "off_esn[notnull]": "",
      "for_esn[notnull]": "",
      "toll_gate[notnull]": "",
      "hours_worked[notnull]": "",
    })
      .then((res) => {
        // Map the table fields to WorkOrder interface fields
        const mappedOrders = res.data.map(
          (
            order: WorkOrder & {
              OFF_ESN?: string;
              FOR_ESN?: string;
              TASK_DESC?: string;
              TASK_STATUS?: string;
              TOLL_GATE?: string;
              WORK_CENTER?: string;
              HOURS_WORKED?: number;
              SEQUENCE?: number;
            }
          ) => ({
            ...order,
            offEngineSerial: order.OFF_ESN,
            forEngineSerial: order.FOR_ESN,
            taskModule: order.TASK_DESC || order.taskModule,
            taskStatus: order.TASK_STATUS || order.taskStatus,
            tollGate: order.TOLL_GATE || order.tollGate,
            workCenterId: order.WORK_CENTER || order.workCenterId,
            hoursWorked: order.HOURS_WORKED || order.hoursWorked,
            sequence: order.SEQUENCE || order.sequence,
          })
        );
        setOrders(mappedOrders);
      })
      .catch(() => setError("Failed to load work orders"))
      .finally(() => setLoading(false));
  }, [page]);

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

  // Filter orders by search string (workOrder, EMPLOYEE_NAME, TASK_DESC)
  const filteredOrders = sortedOrders.filter((order) =>
    [order.workOrder, order.EMPLOYEE_NAME, order.TASK_DESC].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (order: WorkOrder) => {
    navigate(`/work-order/${order.workOrderId}`, {
      state: { workOrder: order },
    });
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto w-full space-y-6">
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
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-blue mb-2"></div>
                  <div className="text-brand-blue font-medium mt-2">Loading...</div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-4 text-red-500" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#fee2e2"/>
                    <path d="M15 9L9 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 9L15 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-red-500 font-semibold text-lg">Cannot retrieve Work Orders</div>
                  <div className="text-muted-foreground text-sm mt-1">Please check your connection or try again later.</div>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 px-3 py-2 border rounded w-full max-w-xs"
                  />
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-brand-navy text-white font-semibold border-b border-brand-blue sticky top-0 z-10">
                        {columns.map((col) => (
                          <TableHead key={col.key} className="bg-brand-navy text-white">
                            {col.label}
                          </TableHead>
                        ))}
                        <TableHead className="bg-brand-navy text-white min-w-[44px] w-1/12 text-center"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order, idx) => (
                        <TableRow
                          key={order.workOrder + idx}
                          className="hover:bg-brand-blue/10 cursor-pointer transition-colors border-b border-brand-blue"
                        >
                          {columns.map((col) => (
                            <TableCell key={col.key}>
                              {col.key === "TASK_STATUS" ? (
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-center whitespace-nowrap ${getStatusColor(
                                    order[col.key]
                                  )}`}
                                >
                                  {order[col.key] ?? "-"}
                                </span>
                              ) : (
                                order[col.key] ?? "-"
                              )}
                            </TableCell>
                          ))}
                          <TableCell className="min-w-[44px] w-1/12 text-center">
                            <button
                              className="p-2 rounded hover:bg-brand-blue/10 focus:outline-none"
                              onClick={() => setModalTask(order)}
                              title="View Details"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-blue">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between mt-4">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                      className="px-4 py-2 bg-gray-200 rounded"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={orders.length < 10}
                    >
                      Next
                    </button>
                  </div>
                  {/* Modal for row details (optional, can be adapted for WorkOrder) */}
                  {modalTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setModalTask(null)}>
                      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setModalTask(null)}
                          title="Close"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-brand-blue">Order Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default MyOrders;
