'use client';

import { Drop, Plus, PintGlass } from '@phosphor-icons/react';

interface WaterEntry {
  id: number;
  amount: number;
  time: string;
}

interface HydrationCardProps {
  totalAmount: number;
  entries: WaterEntry[];
  onAddClick: () => void;
}

export function HydrationCard({ totalAmount, entries, onAddClick }: HydrationCardProps) {
  return (
    <div className="bg-[#6484E2] rounded-[30px] p-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.10)] relative overflow-hidden min-w-[170px] min-h-[100px]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <Drop size={96} weight="bold" className="text-white rotate-12" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1">
          <Drop size={18} weight="bold" className="text-white" />
          <span className="text-white font-bold text-xl leading-none">{totalAmount || 750}</span>
          <span className="text-white/90 font-light text-base leading-none ml-[2px]">ml</span>
        </div>
        <button
          onClick={onAddClick}
          className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.10)]"
        >
          <Plus size={20} weight="bold" />
        </button>
      </div>

      {/* Water Entries */}
      <div className="space-y-2 relative z-10">
        {(entries.length === 0 ? [
          { id: 1, amount: 500, time: '11:13' },
          { id: 2, amount: 250, time: '12:33' },
        ] : entries.slice(0, 2)).map((entry) => (
          <div key={entry.id} className="px-1 py-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PintGlass size={18} weight="bold" className="text-white" />
              <span className="text-white text-sm">{entry.time}</span>
            </div>
            <div className="flex items-center gap-0">
              <span className="text-white font-semibold text-sm">{entry.amount}</span>
              <span className="text-white/90 font-light text-sm ml-[2px]">ml</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
