'use client';

import { Plus, Barbell, Fire } from '@phosphor-icons/react';
import { getExerciseIcon } from '@/lib/utils/exerciseIcons';

interface Exercise {
  id: number;
  name: string;
  caloriesBurned: number;
  durationMinutes: number;
  icon?: string | null;
}

interface ActivityCardProps {
  totalCalories: number;
  exercises: Exercise[];
  onAddClick: () => void;
  onClick?: () => void;
}

export function ActivityCard({ totalCalories, exercises, onAddClick, onClick }: ActivityCardProps) {
  return (
    <div 
      className={`relative rounded-[30px] p-[10px] min-w-[170px] min-h-[100px] bg-[#E5C438] shadow-[0_2px_10px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Decorative bottom-left icon */}
      <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
        <Barbell weight="bold" className="text-white" style={{ width: 100, height: 85 }} />
      </div>
      {/* Header */}
      <div className="flex items-end justify-between mb-[5px] relative z-10">
        <div className="flex items-baseline gap-1">
          <Fire size={18} weight="bold" className="text-[#131917]" />
          <span className="text-[#131917] font-bold leading-none" style={{ fontSize: '28px' }}>{totalCalories}</span>
          <span className="text-[#131917] font-light text-[12px] leading-none ml-[2px]">kcal</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick();
          }}
          className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-gray-900 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.10)]"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>

      {/* Exercises List */}
      <div className="relative z-10 mt-auto">
        {exercises.slice(0, 2).map((exercise) => {
          const Icon = getExerciseIcon(exercise.icon);
          return (
            <div key={exercise.id} className="px-1 py-1 flex items-end justify-between min-w-0">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <Icon size={18} weight="bold" className="text-[#131917] flex-shrink-0" />
                <p className="text-[#131917] font-medium text-sm truncate">{exercise.name}</p>
              </div>
              <div className="flex items-baseline gap-0">
                <span className="text-[#131917] font-semibold text-m">{exercise.caloriesBurned}</span>
                <span className="text-[#131917] font-light text-sm">kcal</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
