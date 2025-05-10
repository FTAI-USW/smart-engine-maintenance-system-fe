import { useState } from "react";
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

const dailyTasksData = [
  {
    priority: 1,
    work_order: "WEN101201-2",
    description: "CORE MAJOR MODULE",
    task: "DISSASSEMBLE AS REQUIRE",
    assigned: "Tomas",
    assigned_2: "Sahan",
    supervisor_notes: "Certified and sent to final",
    work_center: "56-30-STP",
    goal: "CERT BY 1-MAY",
    hours_clocked: 16.4,
    next_sequence: 1250,
    off_esn: "ESN12345",
    for_esn: "ESN67890",
  },
  {
    priority: 5,
    work_order: "WEN101201-2",
    description: "CORE MAJOR MODULE",
    task: "DISSASSEMBLE AS REQUIRE",
    assigned: "Tomas",
    assigned_2: "Sahan",
    supervisor_notes: "Certified and sent to final",
    work_center: "56-30-STP",
    goal: "CERT BY 1-MAY",
    hours_clocked: 16.4,
    next_sequence: 1250,
    off_esn: "ESN12345",
    for_esn: "ESN67890",
  },
  {
    priority: 10,
    work_order: "WEN101201-2",
    description: "COMPRESSOR ROTOR ASSEMBLY",
    task: "DISSASSEMBLE AS REQUIRE",
    assigned: "David",
    assigned_2: "Mabrouka",
    supervisor_notes: "Certified and sent to final",
    work_center: "56-30-STP",
    goal: "CERT BY 1-MAY",
    hours_clocked: 16.4,
    next_sequence: 1250,
    off_esn: "ESN54321",
    for_esn: "ESN09876",
  },
  {
    priority: 10,
    work_order: "WEN101201-2-8",
    description: "CORE MAJOR MODULE",
    task: "DISSASSEMBLE AS REQUIRE",
    assigned: "David",
    assigned_2: "Mabrouka",
    supervisor_notes: "Certified and sent to final",
    work_center: "56-30-STP",
    goal: "CERT BY 1-MAY",
    hours_clocked: 16.4,
    next_sequence: 1250,
    off_esn: "ESN54321",
    for_esn: "ESN09876",
  },
];

const columns = [
  { key: "priority", label: "Priority" },
  { key: "work_order", label: "Work Order" },
  { key: "esn", label: "Engine (OFF_ESN → FOR_ESN)" },
  { key: "description", label: "Description" },
  { key: "task", label: "Task" },
  { key: "assignee", label: "Assignee" },
  { key: "supervisor_notes", label: "Supervisor Notes" },
  { key: "work_center", label: "Work Center" },
  { key: "goal", label: "Goal" },
  { key: "hours_clocked", label: "Hours Clocked" },
  { key: "next_sequence", label: "Next Sequence" },
];

function getAssignee(task) {
  return [task.assigned, task.assigned_2].filter(Boolean).join(", ");
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalTask, setModalTask] = useState(null);

  // Example last updated date (could be dynamic in the future)
  const lastUpdated = new Date().toLocaleString();

  // Sorting logic
  const sortedTasks = [...dailyTasksData].sort((a, b) => {
    let aValue = sortBy === "assignee" ? getAssignee(a) : a[sortBy];
    let bValue = sortBy === "assignee" ? getAssignee(b) : b[sortBy];
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (task) => {
    navigate(`/work-order/${task.work_order}`, {
      state: {
        assignees: [task.assigned, task.assigned_2].filter(Boolean),
      },
    });
  };

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
                {sortedTasks.map((task, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-brand-blue/10 cursor-pointer transition-colors border-b border-brand-blue"
                    onClick={() => handleRowClick(task)}
                  >
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.work_order}</TableCell>
                    <TableCell>
                      {task.off_esn && (
                        <span
                          className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/engine/${task.off_esn}`);
                          }}
                        >
                          {task.off_esn}
                        </span>
                      )}
                      {task.off_esn && task.for_esn && <span> → </span>}
                      {task.for_esn && (
                        <span
                          className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/engine/${task.for_esn}`);
                          }}
                        >
                          {task.for_esn}
                        </span>
                      )}
                      {!(task.off_esn || task.for_esn) && "-"}
                    </TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>
                      {getAssignee(task)
                        .split(", ")
                        .map((name, idx, arr) => (
                          <span
                            key={name}
                            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/technician/${encodeURIComponent(name)}`
                              );
                            }}
                          >
                            {name}
                            {idx < arr.length - 1 ? ", " : ""}
                          </span>
                        ))}
                    </TableCell>
                    <TableCell>{task.supervisor_notes}</TableCell>
                    <TableCell>{task.work_center}</TableCell>
                    <TableCell>{task.goal}</TableCell>
                    <TableCell>{task.hours_clocked}</TableCell>
                    <TableCell>{task.next_sequence}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Modal for row details */}
            {modalTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                  <button
                    className="absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setModalTask(null)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-4">Task Details</h3>
                  <div className="space-y-2">
                    {Object.entries(modalTask).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-semibold capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>{" "}
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
