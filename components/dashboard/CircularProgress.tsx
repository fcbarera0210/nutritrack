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
  
  const roundedValue = Math.round(value);
  const valueLength = roundedValue.toString().length;
  
  // Ajustar tamaño de fuente según la cantidad de dígitos
  // 1-2 dígitos: 12px, 3 dígitos: 10px, 4+ dígitos: 9px
  const getValueFontSize = () => {
    if (valueLength <= 2) return '12px';
    if (valueLength === 3) return '10px';
    return '9px';
  };

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
        {/* Center text - en una sola línea */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-medium leading-none" style={{ fontSize: getValueFontSize() }}>
            {roundedValue}
            <span className="text-white/70 ml-0.5" style={{ fontSize: '8px' }}>{unit}</span>
          </span>
        </div>
      </div>
      <p className="text-[10px] font-medium text-white mt-[10px] text-center">{label}</p>
      <p className="text-[8px] text-white/70 mt-0.5">{percentage.toFixed(0)}%</p>
    </div>
  );
}

