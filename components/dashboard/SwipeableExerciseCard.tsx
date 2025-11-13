'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilSimple, Trash, Fire, Clock } from '@phosphor-icons/react';
import { getExerciseIcon } from '@/lib/utils/exerciseIcons';

interface SwipeableExerciseCardProps {
  exercise: any;
  onEdit: (exercise: any) => void;
  onDelete: (exercise: any) => void;
  isOpen: boolean;
  onOpenChange: (exerciseId: number | null) => void;
}

export function SwipeableExerciseCard({ exercise, onEdit, onDelete, isOpen, onOpenChange }: SwipeableExerciseCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const SWIPE_THRESHOLD = 80;
  const ACTION_WIDTH = 140;
  const ExerciseIcon = getExerciseIcon(exercise.icon);

  useEffect(() => {
    if (isOpen) {
      setTranslateX(-ACTION_WIDTH);
    } else {
      setTranslateX(0);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    if (diff < 0) {
      const newTranslateX = Math.max(-ACTION_WIDTH, diff);
      setTranslateX(newTranslateX);
    } else if (diff > 0 && translateX < 0) {
      const newTranslateX = Math.min(0, translateX + diff);
      setTranslateX(newTranslateX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const shouldOpen = translateX <= -SWIPE_THRESHOLD;
    
    if (shouldOpen) {
      setTranslateX(-ACTION_WIDTH);
      onOpenChange(exercise.id);
    } else {
      setTranslateX(0);
      onOpenChange(null);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      currentX.current = e.clientX;
      const diff = currentX.current - startX.current;
      
      if (diff < 0) {
        const newTranslateX = Math.max(-ACTION_WIDTH, diff);
        setTranslateX(newTranslateX);
      } else if (diff > 0 && translateX < 0) {
        const newTranslateX = Math.min(0, translateX + diff);
        setTranslateX(newTranslateX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      const shouldOpen = translateX <= -SWIPE_THRESHOLD;
      
      if (shouldOpen) {
        setTranslateX(-ACTION_WIDTH);
        onOpenChange(exercise.id);
      } else {
        setTranslateX(0);
        onOpenChange(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, translateX, onOpenChange, exercise.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setTranslateX(0);
          onOpenChange(null);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div className="relative overflow-hidden rounded-[15px]">
      {/* Botones de acción (fondo) */}
      <div className="absolute top-0 bottom-0 right-0 flex flex-row z-0" style={{ width: '140px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTranslateX(0);
            onOpenChange(null);
            onEdit(exercise);
          }}
          className="flex-1 bg-[#6484E2] px-6 flex items-center justify-center hover:bg-[#5a75d0] transition-colors h-full"
        >
          <PencilSimple size={20} weight="bold" className="text-white" />
        </button>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            setTranslateX(0);
            onOpenChange(null);
            if (confirm('¿Eliminar este ejercicio?')) {
              await onDelete(exercise);
            }
          }}
          className="flex-1 bg-[#DC3714] px-6 flex items-center justify-center hover:bg-[#c02e11] transition-colors rounded-r-[15px] h-full"
        >
          <Trash size={20} weight="bold" className="text-white" />
        </button>
      </div>

      {/* Card principal (contenido) */}
      <div
        ref={cardRef}
        className={`relative bg-[#131917] p-4 z-10 transition-all duration-300 ease-out ${
          translateX < 0 ? 'rounded-l-[15px]' : 'rounded-[15px]'
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
          touchAction: 'pan-x',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => {
          startX.current = e.clientX;
          currentX.current = startX.current;
          setIsDragging(true);
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Fila 1: Nombre del ejercicio y kcal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <ExerciseIcon size={18} weight="bold" className="text-[#E5C438] flex-shrink-0" />
              <p className="text-white font-semibold text-base truncate">{exercise.name}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Fire size={18} weight="bold" className="text-[#DC3714]" />
              <span className="text-white font-bold text-lg">{exercise.caloriesBurned}</span>
              <span className="text-white/70 text-xs">kcal</span>
            </div>
          </div>
          {/* Fila 2: Duración */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock size={14} weight="bold" className="text-white/70" />
              <p className="text-white/70 text-xs">Duración: {exercise.durationMinutes} min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

