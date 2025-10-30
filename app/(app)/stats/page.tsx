'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AchievementCard } from '@/components/ui/AchievementCard';
import { BottomNav } from '@/components/dashboard/BottomNav';

export default function StatsPage() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState([
    {
      id: 'first_meal',
      name: 'Primera Comida',
      description: 'Registraste tu primer alimento',
      emoji: '🎉',
      unlocked: true,
      unlockedAt: '2025-01-15',
    },
    {
      id: '7_day_streak',
      name: '7 Días Consecutivos',
      description: 'Mantén una racha de 7 días',
      emoji: '🔥',
      unlocked: false,
    },
    {
      id: 'protein_goal_30',
      name: 'Meta de Proteína',
      description: 'Alcanza tu meta 30 días seguidos',
      emoji: '💪',
      unlocked: false,
    },
    {
      id: '100_foods',
      name: 'Centenaria',
      description: 'Registra 100 alimentos diferentes',
      emoji: '🌟',
      unlocked: false,
    },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/weekly');
      if (response.ok) {
        const data = await response.json();
        setWeeklyData(data.dailyCalories || []);
        setRecentWorkouts(data.recentWorkouts || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Estadísticas</h1>
        <p className="text-gray-600 text-sm">Revisa tu progreso y tendencias</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card padding="sm">
          <p className="text-xs text-gray-500 mb-1">Promedio Semanal</p>
          <p className="text-2xl font-bold text-gray-900">2,100</p>
          <p className="text-xs text-gray-500">kcal/día</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 mb-1">Total Registrado</p>
          <p className="text-2xl font-bold text-gray-900">45</p>
          <p className="text-xs text-gray-500">alimentos</p>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <Card className="mb-6 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calorías Semanales</h3>
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calories" stroke="#5FB75D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-gray-500">No hay datos suficientes</p>
          </div>
        )}
      </Card>

      {/* Recent Workouts */}
      <Card className="mb-6 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">🏋️</span>
          Entrenamientos Recientes
        </h3>
        <div className="space-y-2">
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout: any) => {
              const date = new Date(workout.date);
              const today = new Date();
              const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
              let timeAgo = '';
              if (diffDays === 0) timeAgo = 'Hoy';
              else if (diffDays === 1) timeAgo = 'Hace 1 día';
              else timeAgo = `Hace ${diffDays} días`;

              return (
                <div key={workout.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">{workout.caloriesBurned} kcal</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No hay entrenamientos recientes</p>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Logros Desbloqueados</h3>
        <div className="space-y-2">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onUnlock={() => {
                // Aquí podrías agregar lógica adicional cuando se desbloquea un logro
                console.log('Logro desbloqueado:', achievement.name);
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

