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

const data = tasks.map((task) => ({
  type: "scatter",
  mode: "lines",
  x: [task.start, task.end],
  y: [task.name, task.name],
  line: { color: task.color, width: 20 },
  name: task.label,
  hovertemplate: `${task.name}<br>${task.label}<br>%{x|%b %d %H:%M}<extra></extra>`,
}));

const layout = {
  title: "",
  xaxis: {
    title: "Time",
    type: "date",
    showgrid: true,
    zeroline: false,
    autorange: true,
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
  },
  height: 400,
  plot_bgcolor: "#fff",
  paper_bgcolor: "#fff",
  font: { color: "#222" },
  dragmode: "pan",
  showlegend: false,
};

const config = {
  scrollZoom: true,
  displayModeBar: true,
  responsive: true,
};

const Timeline = () => (
  <div className="w-full bg-brand-navy rounded-lg shadow-lg p-6 my-6">
    <h3 className="text-xl font-semibold mb-4 text-white">
      Technician Timeline (Gantt Mockup)
    </h3>
    <div className="overflow-x-auto">
      <Plot
        data={data}
        layout={layout}
        config={config}
        style={{ width: "100%", minWidth: 600 }}
      />
    </div>
  </div>
);

export default Timeline;
