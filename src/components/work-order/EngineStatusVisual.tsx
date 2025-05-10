import React from "react";

interface EngineStatusVisualProps {
  status: "good" | "warning" | "stopped";
}

const fanSpin = `
@keyframes fanSpin { 100% { transform: rotate(360deg); } }
`;
const sparkAnim = `
@keyframes spark { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }
`;

export const EngineStatusVisual: React.FC<EngineStatusVisualProps> = ({
  status,
}) => {
  // Animation speed
  const spinDuration =
    status === "good" ? "1s" : status === "warning" ? "2.5s" : "0s";
  const showSparks = status === "stopped";

  // Status coloring
  const bodyFill =
    status === "stopped"
      ? "url(#stoppedGradient)"
      : status === "warning"
      ? "#facc15"
      : "#22c55e";

  return (
    <div style={{ width: 220, height: 100, position: "relative" }}>
      <style>{fanSpin + sparkAnim}</style>
      <svg width={220} height={100} viewBox="0 0 220 100">
        {/* Gradient definitions and fan mask */}
        <defs>
          {status === "stopped" && (
            <linearGradient id="stoppedGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#222" />
            </linearGradient>
          )}
          {/* Elliptical mask for fan blades */}
          <mask id="fanMask">
            <rect x="0" y="0" width="220" height="100" fill="black" />
            <ellipse cx="55" cy="50" rx="22" ry="26" fill="white" />
          </mask>
        </defs>

        {/* Engine hull with angular facets in the middle (SVG path) */}
        <path
          d="M45,25
            Q60,20 80,25
            L95,25
            L105,35
            L155,35
            L165,25
            Q180,20 195,25
            Q200,50 195,75
            Q180,80 165,75
            L155,65
            L105,65
            L95,75
            L80,75
            Q60,80 45,75
            Q40,50 45,25
            Z"
          fill={bodyFill}
          stroke="#222"
          strokeWidth={2}
        />
        {/* Engine body details: core line and curved panel lines */}
        {/* Central core line */}
        <rect
          x={100}
          y={40}
          width={50}
          height={20}
          rx={10}
          stroke="#444"
          strokeWidth={1}
          opacity={0.7}
        />
        {/* Curved panel lines */}
        <path
          d="M90,32 Q95,50 90,68"
          stroke="#888"
          strokeWidth={1}
          fill="none"
        />
        <path
          d="M110,36 Q115,50 110,64"
          stroke="#888"
          strokeWidth={1}
          fill="none"
        />
        <path
          d="M130,40 Q135,50 130,60"
          stroke="#888"
          strokeWidth={1}
          fill="none"
        />
        {/* Bolts */}
        {[60, 80, 100, 120, 140, 160].map((cx, i) => (
          <circle key={i} cx={cx} cy={35} r={1.5} fill="#444" />
        ))}
        {[60, 80, 100, 120, 140, 160].map((cx, i) => (
          <circle key={i + 10} cx={cx} cy={65} r={1.5} fill="#444" />
        ))}
        {/* Fan group (front) with elliptical mask */}
        <g
          style={{
            transformOrigin: "55px 50px",
            animation: `fanSpin ${spinDuration} linear infinite`,
          }}
          mask="url(#fanMask)"
        >
          {/* Fan hub */}
          <circle
            cx={55}
            cy={50}
            r={18}
            fill="#fff"
            opacity={0.8}
            stroke="#222"
            strokeWidth={2}
          />
          {/* 16 fan blades */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <rect
                key={i}
                x={54}
                y={32}
                width={2}
                height={20}
                rx={1}
                fill="#222"
                opacity={0.85}
                transform={`rotate(${angle} 55 50)`}
              />
            );
          })}
        </g>
        {/* Solid black/gray inlet shape (front left) */}
        <polygon points="36,50 48,35 52,50 48,65" fill="#222" />
        {/* Improved conical, petal-style exhaust nozzle (back right) */}
        <g>
          {/* Main cone */}
          <polygon points="195,40 240,50 195,60" fill="#444" />
        </g>
        {/* Conic nozzle overlay for depth */}
        <path
          d="M45 40 Q50 30 60 40 Q70 50 60 60 Q50 70 45 60 Q50 50 45 40 Z"
          fill="#444"
          opacity={0.8}
        />
        {/* Sparks for stopped */}
        {showSparks && [
          <circle
            key="s1"
            cx={80}
            cy={35}
            r={3}
            fill="#f87171"
            style={{ animation: "spark 0.7s infinite" }}
          />,
          <circle
            key="s2"
            cx={100}
            cy={80}
            r={2}
            fill="#fbbf24"
            style={{ animation: "spark 1.1s infinite 0.3s" }}
          />,
          <circle
            key="s3"
            cx={130}
            cy={30}
            r={2.5}
            fill="#f87171"
            style={{ animation: "spark 0.9s infinite 0.5s" }}
          />,
        ]}
      </svg>
    </div>
  );
};

export default EngineStatusVisual;
