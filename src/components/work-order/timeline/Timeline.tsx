import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import TimelineSidePanel from "./TimelineSidePanel";

const tasks = [
  {
    name: "Tomas",
    label: "T1",
    start: "2024-05-01T08:00:00",
    end: "2024-05-01T10:00:00",
    color: "#FFD600",
    workOrderId: "WO-001",
    esn: "ESN-12345",
    task: "Engine Inspection",
    description: "Complete engine inspection and maintenance",
    priority: "High",
    hours: 2,
    stdHours: 2,
    efficiency: 100,
    status: "In Progress",
    goal: "Complete inspection within standard hours",
    notes: "Check all engine components",
    nextStep: "Proceed to testing phase",
  },
  {
    name: "Sahan",
    label: "T2",
    start: "2024-05-01T10:00:00",
    end: "2024-05-01T14:00:00",
    color: "#00BFAE",
    workOrderId: "WO-002",
    esn: "ESN-12346",
    task: "Component Replacement",
    description: "Replace worn components",
    priority: "Medium",
    hours: 4,
    stdHours: 3.5,
    efficiency: 87.5,
    status: "In Progress",
    goal: "Complete replacement within standard hours",
    notes: "Ensure proper torque settings",
    nextStep: "Verify component installation",
  },
  {
    name: "David",
    label: "T3",
    start: "2024-05-02T09:00:00",
    end: "2024-05-02T15:00:00",
    color: "#FF6D00",
    workOrderId: "WO-003",
    esn: "ESN-12347",
    task: "System Testing",
    description: "Perform system functionality tests",
    priority: "High",
    hours: 6,
    stdHours: 5,
    efficiency: 83.3,
    status: "In Progress",
    goal: "Complete all test procedures",
    notes: "Follow test protocol strictly",
    nextStep: "Document test results",
  },
  {
    name: "Mabrouka",
    label: "T4",
    start: "2024-05-02T13:00:00",
    end: "2024-05-02T21:00:00",
    color: "#B0BEC5",
    workOrderId: "WO-004",
    esn: "ESN-12348",
    task: "Final Inspection",
    description: "Perform final quality inspection",
    priority: "High",
    hours: 8,
    stdHours: 7,
    efficiency: 87.5,
    status: "In Progress",
    goal: "Ensure all quality standards are met",
    notes: "Check all safety systems",
    nextStep: "Prepare for delivery",
  },
];

const perTechnicianHeight = 70;
const barThickness = perTechnicianHeight * 0.5; // 50% of lane height

// Extract unique technician names
const technicianNames = Array.from(new Set(tasks.map((task) => task.name)));

// Define a type for Task
interface Task {
  name: string;
  label: string;
  start: string;
  end: string;
  color: string;
  workOrderId: string;
  esn: string;
  task: string;
  description: string;
  priority: string;
  hours: number;
  stdHours: number;
  efficiency: number;
  status: string;
  goal: string;
  notes: string;
  nextStep: string;
}

interface TimelineProps {
  maxHeight?: string | number;
  workOrderId: string;
  onBarClick?: (technicianName: string) => void;
  setAllTasks?: (tasks: Task[]) => void;
  assignees?: string[];
}

const Timeline = ({
  maxHeight,
  workOrderId,
  onBarClick,
  setAllTasks,
  assignees,
}: TimelineProps) => {
  const [selectedTech, setSelectedTech] = useState<string>("All");
  const [sidePanelTech, setSidePanelTech] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  // Filter tasks based on selected technician and assignees
  const filteredTasks = tasks.filter(
    (task) =>
      (assignees && assignees.length > 0
        ? assignees.includes(task.name)
        : true) && (selectedTech === "All" ? true : task.name === selectedTech)
  );

  const data = [
    {
      type: "bar",
      orientation: "h",
      x: filteredTasks.map(
        (task) => new Date(task.end).getTime() - new Date(task.start).getTime()
      ),
      y: filteredTasks.map((task) => task.name),
      base: filteredTasks.map((task) => new Date(task.start).getTime()),
      marker: { color: filteredTasks.map((task) => task.color) },
      name: "Tasks",
      hovertemplate: `
        <b>Task:</b> %{customdata[0]}<br>
        <b>WO:</b> %{customdata[1]}<br>
        <b>ESN:</b> %{customdata[2]}<br>
        <b>Desc:</b> %{customdata[3]}<br>
        <b>Priority:</b> %{customdata[4]}<br>
        <b>Hours:</b> %{customdata[5]}h / %{customdata[6]}h<br>
        <b>Efficiency:</b> %{customdata[7]}%<br>
        <b>Status:</b> %{customdata[8]}<br>
        <b>Goal:</b> %{customdata[9]}<br>
        <b>Notes:</b> %{customdata[10]}<br>
        <b>Next:</b> %{customdata[11]}<br>
        <extra></extra>
      `,
      customdata: filteredTasks.map((task) => [
        task.task,
        workOrderId,
        task.esn,
        task.description,
        task.priority,
        task.hours,
        task.stdHours,
        task.efficiency,
        task.status,
        task.goal,
        task.notes,
        task.nextStep,
      ]),
    },
  ];

  // Calculate min and max for x-axis
  const minStart = Math.min(
    ...filteredTasks.map((task) => new Date(task.start).getTime())
  );
  const maxEnd = Math.max(
    ...filteredTasks.map((task) => new Date(task.end).getTime())
  );

  // Calculate the desired height
  const windowHeight = window.innerHeight;
  const minHeight = 250;
  const HEADER_OFFSET = 180; // Match the offset from WorkOrder component
  const availableHeight = windowHeight - HEADER_OFFSET;
  const maxAllowedHeight = Math.max(minHeight, availableHeight * 0.8); // 80% of available height

  // First try to use the full available height
  let timelineHeight = windowHeight;

  // If we have a maxHeight prop, use it as a constraint
  if (maxHeight) {
    const propHeight =
      typeof maxHeight === "string" && maxHeight.endsWith("%")
        ? (windowHeight * parseInt(maxHeight)) / 100
        : typeof maxHeight === "string"
        ? parseInt(maxHeight)
        : maxHeight;

    if (!isNaN(Number(propHeight))) {
      timelineHeight = Math.min(timelineHeight, Number(propHeight));
    }
  }

  // Ensure we respect minimum height and maximum height constraints
  timelineHeight = Math.min(
    Math.max(minHeight, timelineHeight),
    maxAllowedHeight
  );

  // Adjust bar thickness based on available height
  const adjustedBarThickness = Math.min(
    barThickness,
    (timelineHeight / filteredTasks.length) * 0.5
  );

  const layout = {
    title: "",
    xaxis: {
      title: "Time",
      type: "date",
      showgrid: true,
      zeroline: false,
      autorange: false,
      range: [minStart, maxEnd],
      constrain: "range",
      tickformatstops: [
        {
          dtickrange: [null, 1000 * 60 * 60 * 12],
          value: "%H:%M",
        },
        {
          dtickrange: [1000 * 60 * 60 * 12, 1000 * 60 * 60 * 24 * 2],
          value: "%b %d %H:%M",
        },
        {
          dtickrange: [1000 * 60 * 60 * 24 * 2, null],
          value: "%b %d",
        },
      ],
    },
    yaxis: {
      title: "Technician Name",
      automargin: true,
      type: "category",
      categoryorder: "array",
      categoryarray: filteredTasks.map((task) => task.name),
      fixedrange: true,
      constrain: "range",
      range: [-0.5, filteredTasks.length - 0.5],
    },
    height: timelineHeight,
    margin: {
      l: 120,
      r: 40,
      t: 40 + adjustedBarThickness / 2,
      b: 60 + adjustedBarThickness / 2,
    },
    plot_bgcolor: "#fff",
    paper_bgcolor: "#fff",
    font: { color: "#222", size: 18 },
    dragmode: "pan",
    showlegend: false,
    bargap: 0,
    bargroupgap: 0,
    barmode: "stack",
  };

  const config = {
    scrollZoom: true,
    displayModeBar: true,
    responsive: true,
  };

  useEffect(() => {
    if (setAllTasks) setAllTasks(tasks);
  }, [setAllTasks]);

  // Handle bar click to open side panel
  interface PlotlyClickPoint {
    pointIndex: number;
  }
  const handleClick = (event: {
    points: Array<PlotlyClickPoint>;
    event: MouseEvent;
  }) => {
    const point = event.points[0];
    if (point && typeof point.pointIndex === "number") {
      const clickedTask = filteredTasks[point.pointIndex];
      if (clickedTask && onBarClick) {
        onBarClick(clickedTask.name);
      }
    }
  };

  return (
    <div
      className="w-full bg-brand-navy rounded-lg shadow-lg p-6 my-6"
      style={{ position: "relative" }}
    >
      <h3 className="text-xl font-semibold mb-4 text-white">
        Technician Timeline (Gantt Mockup)
      </h3>
      <div className="mb-4">
        <label htmlFor="tech-select" className="text-white mr-2">
          Filter by Technician:
        </label>
        <select
          id="tech-select"
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
          className="rounded p-1"
        >
          <option value="All">All</option>
          {technicianNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <Plot
          data={data}
          layout={layout}
          config={config}
          style={{ width: "100%", minWidth: 900 }}
          onClick={handleClick}
        />
        {/* Side Panel for Technician */}
        {sidePanelTech && (
          <TimelineSidePanel
            technicianName={sidePanelTech}
            tasks={tasks.filter((t) => t.name === sidePanelTech)}
            workOrderId={workOrderId}
            onClose={() => setSidePanelTech(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Timeline;
