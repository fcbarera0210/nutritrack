'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Bell, Save, Clock } from 'lucide-react';
import Link from 'next/link';
import { NotificationPermission } from '@/components/features/NotificationPermission';
import { enableMealReminders } from '@/lib/utils/notifications';

const mealTypes = [
  { id: 'breakfast', name: 'Desayuno', emoji: '🌅' },
  { id: 'lunch', name: 'Almuerzo', emoji: '🌆' },
  { id: 'dinner', name: 'Cena', emoji: '🌃' },
  { id: 'snack', name: 'Snack', emoji: '🍎' },
];

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recordatorios</h1>
          <p className="text-gray-600 text-sm">Configura alertas para tus comidas</p>
        </div>
      </div>

      {/* Notification Permission */}
      <div className="mb-6">
        <NotificationPermission />
      </div>

      <div className="space-y-4">
        {mealTypes.map((meal) => {
          const reminder = getReminderForMeal(meal.id);
          const [hour, setHour] = useState(reminder?.hour || 8);
          const [minute, setMinute] = useState(reminder?.minute || 0);

          return (
            <Card key={meal.id} padding="md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meal.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{meal.name}</p>
                    <p className="text-xs text-gray-500">Hora del recordatorio</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={reminder?.enabled || false}
                    onChange={(e) => reminder && toggleReminder(reminder.id, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5FB75D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5FB75D]"></div>
                </label>
              </div>

              {reminder?.enabled && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={hour}
                      onChange={(e) => setHour(parseInt(e.target.value))}
                      className="w-12 text-center font-semibold text-gray-900 bg-transparent border-none"
                    />
                    <span className="text-gray-500">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minute}
                      onChange={(e) => setMinute(parseInt(e.target.value))}
                      className="w-12 text-center font-semibold text-gray-900 bg-transparent border-none"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleTimeChange(meal.id, hour, minute)}
                    isLoading={isLoading}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Los recordatorios te ayudarán a mantener el hábito de registrar tus comidas.
        </p>
      </div>
    </div>
  );
}

