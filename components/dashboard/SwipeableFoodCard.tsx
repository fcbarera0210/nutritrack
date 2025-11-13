'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilSimple, Trash, Fish, Grains, Avocado } from '@phosphor-icons/react';

interface SwipeableFoodCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  isOpen: boolean;
  onOpenChange: (itemId: number | null) => void;
}

export function SwipeableFoodCard({ item, onEdit, onDelete, isOpen, onOpenChange }: SwipeableFoodCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  
  const SWIPE_THRESHOLD = 80; // Píxeles necesarios para activar el swipe
  const ACTION_WIDTH = 140; // Ancho total de los botones de acción

  // Actualizar translateX cuando isOpen cambia externamente
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
    
    // Solo permitir deslizar hacia la izquierda (valores negativos)
    if (diff < 0) {
      const newTranslateX = Math.max(-ACTION_WIDTH, diff);
      setTranslateX(newTranslateX);
    } else if (diff > 0 && translateX < 0) {
      // Permitir deslizar de vuelta hacia la derecha
      const newTranslateX = Math.min(0, translateX + diff);
      setTranslateX(newTranslateX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Determinar si se debe mantener abierto o cerrar
    const shouldOpen = translateX <= -SWIPE_THRESHOLD;
    
    if (shouldOpen) {
      setTranslateX(-ACTION_WIDTH);
      onOpenChange(item.id);
    } else {
      setTranslateX(0);
      onOpenChange(null);
    }
  };

  // Manejo de mouse para desktop (opcional, pero puede ser útil)
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
        onOpenChange(item.id);
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
  }, [isDragging, translateX, onOpenChange, item.id]);

  // Cerrar cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      // Verificar que el click no sea en el contenedor (que incluye los botones de acción)
      if (containerRef.current && !containerRef.current.contains(target)) {
        if (isOpen) {
          setTranslateX(0);
          onOpenChange(null);
        }
      }
    };

    if (isOpen) {
      // Usar un pequeño delay para evitar que se cierre antes de que se ejecute el onClick
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, onOpenChange]);

  // Calcular valores para mostrar
  const actualQuantity = item.quantity * (item.servingSize || 100);
  const servingUnit = item.servingUnit || 'g';
  const itemProtein = Math.round((item.protein * item.quantity) * 10) / 10;
  const itemCarbs = Math.round((item.carbs * item.quantity) * 10) / 10;
  const itemFat = Math.round((item.fat * item.quantity) * 10) / 10;
  const itemCalories = Math.round(item.calories * item.quantity);

  const formatUnit = (unit: string) => {
    if (unit === 'g') return 'g';
    if (unit === 'ml') return 'ml';
    if (unit === 'unit') return ' unidad' + (actualQuantity !== 1 ? 'es' : '');
    return ' unidad' + (actualQuantity !== 1 ? 'es' : '');
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-[15px]">
      {/* Botones de acción (fondo) */}
      <div ref={actionButtonsRef} className="absolute top-0 bottom-0 right-0 flex flex-row z-0" style={{ width: '140px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTranslateX(0);
            onOpenChange(null);
            // Pequeño delay para asegurar que el estado se actualice antes de abrir el modal
            setTimeout(() => {
              onEdit(item);
            }, 0);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setTranslateX(0);
            onOpenChange(null);
            setTimeout(() => {
              onEdit(item);
            }, 0);
          }}
          className="flex-1 bg-[#6484E2] px-6 flex items-center justify-center hover:bg-[#5a75d0] transition-colors h-full"
        >
          <PencilSimple size={20} weight="bold" className="text-white" />
        </button>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            setTranslateX(0);
            onOpenChange(null);
            setTimeout(async () => {
              if (confirm('¿Eliminar este alimento?')) {
                await onDelete(item);
              }
            }, 0);
          }}
          onTouchEnd={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            setTranslateX(0);
            onOpenChange(null);
            setTimeout(async () => {
              if (confirm('¿Eliminar este alimento?')) {
                await onDelete(item);
              }
            }, 0);
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
          {/* Fila 1: Nombre del alimento y kcal */}
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold text-base min-w-0 truncate">{item.name}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white font-bold text-lg">{itemCalories}</span>
              <span className="text-white/70 text-xs">kcal</span>
            </div>
          </div>
          {/* Fila 2: Cantidad y macros */}
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-xs flex-shrink-0">Cantidad: {actualQuantity}{formatUnit(servingUnit)}</p>
            {/* Macros */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Fish size={14} weight="bold" className="text-[#3CCC1F]" />
                <span className="text-white/70 text-xs">{itemProtein}g</span>
              </div>
              <div className="flex items-center gap-1">
                <Grains size={14} weight="bold" className="text-[#E5C438]" />
                <span className="text-white/70 text-xs">{itemCarbs}g</span>
              </div>
              <div className="flex items-center gap-1">
                <Avocado size={14} weight="bold" className="text-[#DC3714]" />
                <span className="text-white/70 text-xs">{itemFat}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

