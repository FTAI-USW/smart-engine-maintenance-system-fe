
import React from "react";

interface ProgressCircleProps {
  percentage: number;
  size: number;
  strokeWidth: number;
}

export function ProgressCircle({ percentage, size, strokeWidth }: ProgressCircleProps) {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;
  
  // Determine color based on percentage
  const getColor = () => {
    if (clampedPercentage < 25) return "#ef4444"; // Red
    if (clampedPercentage < 50) return "#f97316"; // Orange
    if (clampedPercentage < 75) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-muted stroke-current"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="stroke-current transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={getColor()}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute text-xs font-medium">{clampedPercentage}%</span>
    </div>
  );
}
