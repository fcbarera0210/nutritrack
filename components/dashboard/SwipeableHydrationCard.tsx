'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash, PintGlass, Drop, Clock } from '@phosphor-icons/react';

interface SwipeableHydrationCardProps {
  entry: any;
  onDelete: (entry: any) => void;
  isOpen: boolean;
  onOpenChange: (entryId: number | null) => void;
}

export function SwipeableHydrationCard({ entry, onDelete, isOpen, onOpenChange }: SwipeableHydrationCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const ACTION_WIDTH = 70; // Solo un botón de eliminar
  const SWIPE_THRESHOLD = 35; // 50% del ancho del botón para activar el swipe

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
      onOpenChange(entry.id);
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
        onOpenChange(entry.id);
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
  }, [isDragging, translateX, onOpenChange, entry.id]);

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
      {/* Botón de acción (fondo) */}
      <div className="absolute top-0 bottom-0 right-0 flex flex-row z-0" style={{ width: '70px' }}>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            setTranslateX(0);
            onOpenChange(null);
            if (confirm('¿Eliminar este registro de agua?')) {
              await onDelete(entry);
            }
          }}
          className="w-full bg-[#DC3714] px-6 flex items-center justify-center hover:bg-[#c02e11] transition-colors rounded-r-[15px] h-full"
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
          {/* Fila 1: Nombre y cantidad */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <PintGlass size={18} weight="bold" className="text-[#6484E2] flex-shrink-0" />
              <p className="text-white font-semibold text-base whitespace-nowrap">Vaso de agua</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Drop size={18} weight="bold" className="text-[#6484E2]" />
              <span className="text-white font-bold text-lg">{entry.amount}</span>
              <span className="text-white/70 text-xs">ml</span>
            </div>
          </div>
          {/* Fila 2: Hora */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock size={14} weight="bold" className="text-white/70" />
              <p className="text-white/70 text-xs">Hora: {entry.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

