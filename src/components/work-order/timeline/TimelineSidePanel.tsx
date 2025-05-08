import React from "react";

export type Task = {
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
};

interface TimelineSidePanelProps {
  technicianName: string;
  tasks: Task[];
  workOrderId: string;
  onClose: () => void;
}

const HEADER_HEIGHT = 20; // Adjust to match your actual header height in px

const TimelineSidePanel: React.FC<TimelineSidePanelProps> = ({
  technicianName,
  tasks,
  workOrderId,
  onClose,
}) => (
  <>
    {/* Custom slide-in animation */}
    <style>{`
      .slide-in-panel {
        animation: slideInPanel 0.35s cubic-bezier(0.4,0,0.2,1);
      }
      @keyframes slideInPanel {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `}</style>
    {/* Backdrop */}
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-40"
      onClick={onClose}
      aria-label="Close side panel backdrop"
    />
    <div
      className={`fixed right-0 top-[${HEADER_HEIGHT}px] h-[calc(100vh-${HEADER_HEIGHT}px)] w-[370px] bg-brand-navy text-white shadow-2xl z-50 p-6 flex flex-col slide-in-panel`}
      style={{
        top: HEADER_HEIGHT,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="self-end bg-transparent border-none text-white text-2xl cursor-pointer mb-4 transition-colors hover:text-brand-yellow"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-3 text-white">
        Technician: {technicianName}
      </h2>
      <div className="font-semibold mb-2 text-brand-yellow">Tasks:</div>
      <ul className="list-none p-0">
        {tasks.map((t, idx) => (
          <li
            key={idx}
            className="mb-4 p-3 bg-brand-navy border-2 border-brand-orange rounded-lg shadow"
          >
            <div>
              <b className="text-brand-yellow">Task:</b> {t.task}
            </div>
            <div>
              <b className="text-brand-orange">WO:</b> {workOrderId}
            </div>
            <div>
              <b className="text-brand-teal">ESN:</b> {t.esn}
            </div>
            <div>
              <b className="text-brand-yellow">Desc:</b> {t.description}
            </div>
            <div>
              <b className="text-brand-orange">Priority:</b> {t.priority}
            </div>
            <div>
              <b className="text-brand-yellow">Hours:</b> {t.hours}h /{" "}
              {t.stdHours}h
            </div>
            <div>
              <b className="text-brand-teal">Status:</b> {t.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </>
);

export default TimelineSidePanel;
