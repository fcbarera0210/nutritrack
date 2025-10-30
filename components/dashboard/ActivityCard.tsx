'use client';

import { Plus, Barbell, Fire, PersonSimpleWalk } from '@phosphor-icons/react';

interface Exercise {
  id: number;
  name: string;
  caloriesBurned: number;
  durationMinutes: number;
}

interface ActivityCardProps {
  totalCalories: number;
  exercises: Exercise[];
  onAddClick: () => void;
}

export function ActivityCard({ totalCalories, exercises, onAddClick }: ActivityCardProps) {
  return (
    <div className="relative rounded-[30px] p-[10px] min-w-[170px] min-h-[100px] bg-[#E5C438] shadow-[0_2px_10px_rgba(0,0,0,0.10)] overflow-hidden">
      {/* Decorative bottom-left icon */}
      <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
        <Barbell weight="bold" className="text-white" style={{ width: 100, height: 85 }} />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1">
          <Fire size={18} weight="bold" className="text-[#131917]" />
          <span className="text-[#131917] font-bold text-xl leading-none">{totalCalories || 685}</span>
          <span className="text-[#131917] font-light text-base leading-none ml-[2px]">kcal</span>
        </div>
        <button
          onClick={onAddClick}
          className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-gray-900 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.10)]"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>

      {/* Exercises List */}
      <div className="space-y-2 relative z-10">
        {(exercises.length === 0 ? [
          { id: 1, name: 'CrossFit', caloriesBurned: 600, durationMinutes: 45 },
          { id: 2, name: 'Caminata', caloriesBurned: 85, durationMinutes: 30 },
        ] : exercises.slice(0, 2)).map((exercise) => {
          const Icon = exercise.name.toLowerCase().includes('cross') ? Barbell : PersonSimpleWalk;
          return (
            <div key={exercise.id} className="px-1 py-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon size={18} weight="bold" className="text-[#131917]" />
                <p className="text-[#131917] font-medium text-sm">{exercise.name}</p>
              </div>
              <div className="flex items-center gap-0">
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
