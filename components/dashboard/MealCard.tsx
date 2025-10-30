'use client';

import { Plus, Fish, Bread, Avocado } from '@phosphor-icons/react';
import Image from 'next/image';

interface MealCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  itemCount: number;
  onClick: () => void;
  imageUrl?: string;
}

const mealLabels = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snacks',
};

export function MealCard({ mealType, calories, itemCount, onClick, imageUrl }: MealCardProps) {
  const demoImages = [
    `https://picsum.photos/seed/${mealType}-1/46/46`,
    `https://picsum.photos/seed/${mealType}-2/46/46`,
  ];
  return (
    <div
      onClick={onClick}
      className="bg-[#131917] rounded-[30px] px-[20px] py-[15px] mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.10)] flex items-center justify-between gap-3 cursor-pointer"
    >
      {/* Left section */}
      <div className="flex-1">
        <p className="text-white font-semibold text-[24px] leading-tight mb-2">{mealLabels[mealType]}</p>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-white font-semibold text-[24px] leading-none">{calories || 385}</span>
          <span className="text-white/90 font-light text-base leading-none ml-[2px]">kcal</span>
        </div>
        {/* Nutrients */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Fish size={16} weight="bold" className="text-[#CEFB48]" />
            <span className="text-white text-sm">18&nbsp;g</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Bread size={16} weight="bold" className="text-[#E5C438]" />
            <span className="text-white text-sm">18&nbsp;g</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Avocado size={16} weight="bold" className="text-[#DC3714]" />
            <span className="text-white text-sm">18&nbsp;g</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-[140px] flex-shrink-0">
        <div className="flex justify-end items-center mb-2">
          <div className="w-[46px] h-[46px] rounded-[10px] overflow-hidden bg-white/20">
            <Image src={imageUrl || demoImages[0]} alt={mealLabels[mealType]} width={46} height={46} className="object-cover w-full h-full" />
          </div>
          <div className="w-[46px] h-[46px] rounded-[10px] overflow-hidden bg-white/20 -ml-4">
            <Image src={imageUrl || demoImages[1]} alt={mealLabels[mealType]} width={46} height={46} className="object-cover w-full h-full" />
          </div>
          <button
            className="w-[46px] h-[46px] rounded-[10px] bg-[#D9D9D9] flex items-center justify-center text-[#131917] -ml-4 border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.10)]"
            aria-label="Agregar comida"
          >
            <Plus size={24} weight="bold" />
          </button>
        </div>
        <p className="text-white/90 font-light text-[10px] text-center">{itemCount || 2} comida{(itemCount || 2) !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}
