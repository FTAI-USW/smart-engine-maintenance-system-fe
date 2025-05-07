import React, { useState } from "react";
import Plot from "react-plotly.js";

const tasks = [
  {
    name: "Tomas",
    label: "T1",
    start: "2024-05-01T08:00:00",
    end: "2024-05-01T10:00:00",
    color: "#FFD600",
  },
  {
    name: "Sahan",
    label: "T2",
    start: "2024-05-01T10:00:00",
    end: "2024-05-01T14:00:00",
    color: "#00BFAE",
  },
  {
    name: "David",
    label: "T3",
    start: "2024-05-02T09:00:00",
    end: "2024-05-02T15:00:00",
    color: "#FF6D00",
  },
  {
    name: "Mabrouka",
    label: "T4",
    start: "2024-05-02T13:00:00",
    end: "2024-05-02T21:00:00",
    color: "#B0BEC5",
  },
];

const perTechnicianHeight = 70;
const barThickness = perTechnicianHeight * 0.5; // 50% of lane height

// Extract unique technician names
const technicianNames = Array.from(new Set(tasks.map((task) => task.name)));

const Timeline = () => {
  const [selectedTech, setSelectedTech] = useState<string>("All");

  // Filter tasks based on selected technician
  const filteredTasks =
    selectedTech === "All"
      ? tasks
      : tasks.filter((task) => task.name === selectedTech);

  const data = filteredTasks.map((task) => ({
    type: "scatter",
    mode: "lines",
    x: [task.start, task.end],
    y: [task.name, task.name],
    line: { color: task.color, width: barThickness },
    name: task.label,
    hovertemplate: `${task.name}<br>${task.label}<br>%{x|%b %d %H:%M}<extra></extra>`,
  }));

  // Calculate min and max for x-axis
  const minStart = Math.min(
    ...filteredTasks.map((task) => new Date(task.start).getTime())
  );
  const maxEnd = Math.max(
    ...filteredTasks.map((task) => new Date(task.end).getTime())
  );

  const layout = {
    title: "",
    xaxis: {
      title: "Time",
      type: "date",
      showgrid: true,
      zeroline: false,
      autorange: false,
      range: [new Date(minStart).toISOString(), new Date(maxEnd).toISOString()],
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
    height: Math.max(250, filteredTasks.length * perTechnicianHeight),
    margin: {
      l: 120,
      r: 40,
      t: 40 + barThickness / 2,
      b: 60 + barThickness / 2,
    },
    plot_bgcolor: "#fff",
    paper_bgcolor: "#fff",
    font: { color: "#222", size: 18 },
    dragmode: "pan",
    showlegend: false,
  };

  const config = {
    scrollZoom: true,
    displayModeBar: true,
    responsive: true,
  };

  return (
    <div className="w-full bg-brand-navy rounded-lg shadow-lg p-6 my-6">
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
        />
      </div>
    </div>
  );
};

export default Timeline;
