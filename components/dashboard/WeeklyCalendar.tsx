'use client';

import { useState, useEffect, useRef } from 'react';
import { CaretLeft, CaretRight, CalendarBlank, Fire } from '@phosphor-icons/react';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  streakDays?: Date[];
}

export function WeeklyCalendar({ selectedDate, onDateChange, streakDays = [] }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  const [showFireIcon, setShowFireIcon] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Alternar entre ícono de llama (3s) y vocal (2s)
  useEffect(() => {
    const scheduleNext = () => {
      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setShowFireIcon(prev => {
        const nextState = !prev;
        
        // Programar el siguiente cambio
        if (nextState) {
          // Mostrar ícono por 3 segundos
          timeoutRef.current = setTimeout(() => {
            scheduleNext();
          }, 3000);
        } else {
          // Mostrar vocal por 2 segundos
          timeoutRef.current = setTimeout(() => {
            scheduleNext();
          }, 2000);
        }
        
        return nextState;
      });
    };

    // Iniciar el ciclo: empezar mostrando el ícono por 3 segundos
    timeoutRef.current = setTimeout(() => {
      scheduleNext();
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const hasStreak = (date: Date) => {
    return streakDays.some(streakDate => isSameDay(date, streakDate));
  };

  return (
    <div className="bg-[#404040] rounded-[30px] pt-[15px] pr-[20px] pb-[10px] pl-[20px]">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-[5px]">
        <div className="flex items-center gap-1">
          <CalendarBlank size={20} weight="bold" color="#D9D9D9" />
          <span className="text-[20px] font-medium text-[#D9D9D9] capitalize">
            {format(currentWeek, 'MMM yyyy', { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousWeek}
            className="w-7 h-7 rounded-full bg-[#D9D9D9] flex items-center justify-center hover:opacity-90 transition"
          >
            <CaretLeft size={16} weight="bold" color="#1E1E1E" />
          </button>
          <button
            onClick={handleNextWeek}
            className="w-7 h-7 rounded-full bg-[#D9D9D9] flex items-center justify-center hover:opacity-90 transition"
          >
            <CaretRight size={16} weight="bold" color="#1E1E1E" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-3">
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isDisabled = date > new Date();

          const dayTextColor = isDisabled ? '#5A5B5A' : '#D9D9D9';

          return (
            <button
              key={date.toISOString()}
              onClick={() => !isDisabled && onDateChange(date)}
              disabled={isDisabled}
              className="relative flex flex-col items-center justify-start py-1 px-1"
            >
              <span
                className={`inline-flex flex-col items-center gap-[10px] rounded-full px-[10px] py-[15px] ${
                  isSelected ? 'bg-[#3CCC1F] text-[#131917]' : ''
                }`}
                style={{ color: isSelected ? '#131917' : dayTextColor }}
              >
                {hasStreak(date) ? (
                  <span className="relative inline-flex items-center justify-center" style={{ width: '14px', height: '14px' }}>
                    {/* Ícono de llama */}
                    <span 
                      className={`fade-transition absolute inset-0 flex items-center justify-center ${
                        showFireIcon ? 'fade-in' : 'fade-out'
                      }`}
                    >
                      <span className={isSelected ? '' : 'animate-color-wave'}>
                        <Fire size={14} weight="bold" className={isSelected ? 'text-[#131917]' : ''} />
                      </span>
                    </span>
                    {/* Vocal del día */}
                    <span 
                      className={`fade-transition absolute inset-0 flex items-center justify-center text-[14px] font-medium leading-none ${
                        showFireIcon ? 'fade-out' : 'fade-in'
                      }`}
                      style={{ color: isSelected ? '#131917' : dayTextColor }}
                    >
                      {weekDays[index]}
                    </span>
                  </span>
                ) : (
                  <span className="text-[14px] font-medium leading-none">
                    {weekDays[index]}
                  </span>
                )}
                <span className={`text-[16px] leading-none ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {format(date, 'd')}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
