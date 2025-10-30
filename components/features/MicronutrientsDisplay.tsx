'use client';

import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

interface Micronutrient {
  name: string;
  value: number;
  target: number;
  unit: string;
}

interface MicronutrientsDisplayProps {
  micronutrients: Micronutrient[];
}

export function MicronutrientsDisplay({ micronutrients }: MicronutrientsDisplayProps) {
  const getPercentage = (value: number, target: number) => {
    return Math.round((value / target) * 100);
  };

  const getStatus = (percentage: number) => {
    if (percentage >= 100) return 'met';
    if (percentage >= 80) return 'almost';
    return 'low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'text-green-600';
      case 'almost':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'bg-green-500';
      case 'almost':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span className="text-lg">🔬</span>
        Micronutrientes
      </h3>

      {micronutrients.map((nutrient) => {
        const percentage = getPercentage(nutrient.value, nutrient.target);
        const status = getStatus(percentage);

        return (
          <Card key={nutrient.name} padding="sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${getStatusColor(status)}`} />
                  <span className="text-sm font-medium text-gray-900">{nutrient.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{nutrient.value}{nutrient.unit}</span>
                  <span className="text-xs text-gray-500 ml-1">/ {nutrient.target}{nutrient.unit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(status)} transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${getStatusColor(status)}`}>
                  {percentage}%
                </span>
              </div>
            </div>
          </Card>
        );
      })}

      {micronutrients.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay datos de micronutrientes disponibles
        </p>
      )}
    </div>
  );
}


