'use client';

interface CircularProgressProps {
  percentage: number;
  value: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}

export function CircularProgress({
  percentage,
  value,
  label,
  unit,
  color,
  size = 73
}: CircularProgressProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle fill */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="#404040" />
          {/* Track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#5A5B5A"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[12px] font-medium text-white">{percentage}%</span>
        </div>
      </div>
      <p className="text-[10px] font-medium text-white mt-[10px] text-center">{label}</p>
    </div>
  );
}

