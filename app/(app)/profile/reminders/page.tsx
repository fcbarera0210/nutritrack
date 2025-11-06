'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, FloppyDisk, Clock, SunHorizon, Sun, MoonStars, Orange, Lightbulb } from '@phosphor-icons/react';
import { NotificationPermission } from '@/components/features/NotificationPermission';
import { enableMealReminders } from '@/lib/utils/notifications';
import { BottomNav } from '@/components/dashboard/BottomNav';

const mealTypes = [
  { id: 'breakfast', name: 'Desayuno', icon: SunHorizon },
  { id: 'lunch', name: 'Almuerzo', icon: Sun },
  { id: 'dinner', name: 'Cena', icon: MoonStars },
  { id: 'snack', name: 'Snack', icon: Orange },
];

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [times, setTimes] = useState<Record<string, { hour: number; minute: number }>>({});

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    // Inicializar tiempos cuando se cargan los recordatorios
    const initialTimes: Record<string, { hour: number; minute: number }> = {};
    mealTypes.forEach((meal) => {
      const reminder = reminders.find(r => r.mealType === meal.id);
      if (reminder) {
        initialTimes[meal.id] = { hour: reminder.hour, minute: reminder.minute };
      } else {
        initialTimes[meal.id] = { hour: 8, minute: 0 };
      }
    });
    setTimes(initialTimes);
  }, [reminders]);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const getReminderForMeal = (mealType: string) => {
    return reminders.find(r => r.mealType === mealType);
  };

  const formatTime = (hour: number, minute: number) => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleTimeChange = async (mealType: string, hour: number, minute: number) => {
    setIsLoading(true);
    try {
      const existing = getReminderForMeal(mealType);
      
      if (existing) {
        // Actualizar existente
        await fetch(`/api/reminders/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hour, minute, enabled: true }),
        });
      } else {
        // Crear nuevo
        await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mealType, hour, minute, enabled: true }),
        });
      }
      
      await fetchReminders();
      
      // Activar notificaciones del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        enableMealReminders([{ mealType, hour, minute }]);
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Error al guardar recordatorio');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReminder = async (id: number, enabled: boolean) => {
    setIsLoading(true);
    try {
      await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      await fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (mealType: string, enabled: boolean) => {
    setIsLoading(true);
    try {
      const existing = getReminderForMeal(mealType);
      
      if (existing) {
        // Si existe, solo activar/desactivar
        await toggleReminder(existing.id, enabled);
        
        // Mostrar notificación de prueba si se activa
        if (enabled && 'Notification' in window && Notification.permission === 'granted') {
          const mealNames: { [key: string]: string } = {
            breakfast: 'Desayuno',
            lunch: 'Almuerzo',
            dinner: 'Cena',
            snack: 'Snack',
          };
          new Notification(`Recordatorio de ${mealNames[mealType]} activado ✅`, {
            body: `Recibirás notificaciones a las ${existing.hour.toString().padStart(2, '0')}:${existing.minute.toString().padStart(2, '0')}`,
            icon: '/icon-192x192.png',
          });
        }
      } else if (enabled) {
        // Si no existe y se está activando, crear uno nuevo con hora por defecto
        const time = times[mealType] || { hour: 8, minute: 0 };
        await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            mealType, 
            hour: time.hour, 
            minute: time.minute, 
            enabled: true 
          }),
        });
        await fetchReminders();
        
        // Activar notificaciones del navegador y mostrar notificación de prueba
        if ('Notification' in window && Notification.permission === 'granted') {
          enableMealReminders([{ mealType, hour: time.hour, minute: time.minute }]);
          
          const mealNames: { [key: string]: string } = {
            breakfast: 'Desayuno',
            lunch: 'Almuerzo',
            dinner: 'Cena',
            snack: 'Snack',
          };
          new Notification(`Recordatorio de ${mealNames[mealType]} activado ✅`, {
            body: `Recibirás notificaciones a las ${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`,
            icon: '/icon-192x192.png',
          });
        }
      }
    } catch (error) {
      console.error('Error handling toggle:', error);
      alert('Error al activar/desactivar recordatorio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] pb-24">
      {/* Header oscuro */}
      <div className="bg-[#131917] rounded-b-[30px] px-6 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-white font-semibold text-xl">Recordatorios</h1>
            <p className="text-white/70 text-sm">Configura alertas para tus comidas</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-6 pt-6 pb-20 max-w-md mx-auto">
        {/* Notification Permission - Deshabilitado temporalmente */}
        {/* <div className="mb-6">
          <NotificationPermission />
        </div> */}

        <div className="mb-6 p-4 bg-[#CEFB48]/70 rounded-[20px]">
          <p className="text-sm text-[#131917] text-center" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <strong>⚠️</strong> La funcionalidad de recordatorios está temporalmente deshabilitada.
          </p>
        </div>

        {/* Cards de recordatorios - Deshabilitadas temporalmente */}
        {/* <div className="space-y-4">
          {mealTypes.map((meal) => {
            const reminder = getReminderForMeal(meal.id);
            const time = times[meal.id] || { hour: 8, minute: 0 };
            const IconComponent = meal.icon;

            return (
              <div key={meal.id} className="bg-[#131917] rounded-[30px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent size={24} weight="bold" className="text-white" />
                    <div>
                      <p className="font-semibold text-white text-[16px]">{meal.name}</p>
                      <p className="text-xs text-white/70">Hora del recordatorio</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={reminder?.enabled || false}
                      onChange={(e) => handleToggle(meal.id, e.target.checked)}
                      disabled={isLoading}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CEFB48]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CEFB48]"></div>
                  </label>
                </div>

                {reminder?.enabled && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-[10px] rounded-[15px] flex-1">
                      <Clock size={18} weight="bold" className="text-white/70" />
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={time.hour}
                        onChange={(e) => setTimes({ ...times, [meal.id]: { ...time, hour: parseInt(e.target.value) || 0 } })}
                        className="w-12 text-center font-semibold text-white text-[16px] bg-transparent border-none focus:outline-none"
                      />
                      <span className="text-white/70">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={time.minute}
                        onChange={(e) => setTimes({ ...times, [meal.id]: { ...time, minute: parseInt(e.target.value) || 0 } })}
                        className="w-12 text-center font-semibold text-white text-[16px] bg-transparent border-none focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleTimeChange(meal.id, time.hour, time.minute)}
                      disabled={isLoading}
                      className="w-12 h-12 rounded-[15px] bg-[#CEFB48] text-[#131917] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <FloppyDisk size={20} weight="bold" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div> */}

        {/* Tip */}
        <div className="mt-6 p-4 rounded-[20px]">
          <p className="text-sm text-[#131917] flex items-center gap-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            <Lightbulb size={20} weight="bold" className="text-[#6484E2]" />
            <span><strong>Tip:</strong> Los recordatorios te ayudarán a mantener el hábito de registrar tus comidas.</span>
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

