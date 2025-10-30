'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dashboard/Header';
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { HydrationCard } from '@/components/dashboard/HydrationCard';
import { MealCard } from '@/components/dashboard/MealCard';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Fire, Plus, Minus } from '@phosphor-icons/react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 67,
  });

  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [meals, setMeals] = useState({
    breakfast: { totalCalories: 0, items: [] },
    lunch: { totalCalories: 0, items: [] },
    dinner: { totalCalories: 0, items: [] },
    snack: { totalCalories: 0, items: [] },
  });
  const [exercises, setExercises] = useState([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [waterEntries, setWaterEntries] = useState([]);
  const [totalWater, setTotalWater] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/today');
      const data = await response.json();
      
      if (response.ok) {
        setTodayStats(prev => ({
          ...prev,
          calories: data.totals?.calories || 0,
          protein: data.totals?.protein || 0,
          carbs: data.totals?.carbs || 0,
          fat: data.totals?.fat || 0,
        }));
        setStreak(data.streak || 0);
        setMeals(data.meals || {
          breakfast: { totalCalories: 0, items: [] },
          lunch: { totalCalories: 0, items: [] },
          dinner: { totalCalories: 0, items: [] },
          snack: { totalCalories: 0, items: [] },
        });
        setExercises(data.exercises || []);
        setTotalCaloriesBurned(data.totalCaloriesBurned || 0);
        setWaterEntries([]);
        setTotalWater(0);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const streakDays = streak > 0 ? [new Date()] : [];
  const proteinProgress = (todayStats.protein / todayStats.targetProtein) * 100;
  const carbsProgress = (todayStats.carbs / todayStats.targetCarbs) * 100;
  const fatProgress = (todayStats.fat / todayStats.targetFat) * 100;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header + dark section wrapper */}
      <div className="bg-[#131917] rounded-b-[60px]">
        <div className="px-25 pb-[15px] flex flex-col gap-[30px]">
          <div>
            <Header />
          </div>
          {/* Weekly Calendar inside dark area */}
          <div>
            <WeeklyCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              streakDays={streakDays}
            />
          </div>
          {/* Kcal Box */}
          <div className="flex flex-col items-center">
            {streak > 0 && (
              <div className="flex items-center gap-2 mb-[5px]">
                <Fire size={21} weight="bold" className="text-[#DC3714]" />
                <p className="text-white text-[14px] font-medium">Llevas {streak} día{streak !== 1 ? 's' : ''} de racha, sigue así !!</p>
              </div>
            )}
            <div className="text-white text-[36px] font-semibold">
              1050 kcal
            </div>
          </div>

          {/* Circular Macros (inside dark box) */}
          <div className="grid grid-cols-3 gap-4">
            <CircularProgress
              percentage={35}
              value={35}
              label="Proteínas"
              unit="%"
              color="#CEF154"
            />
            <CircularProgress
              percentage={70}
              value={70}
              label="Carbohidratos"
              unit="%"
              color="#E5C438"
            />
            <CircularProgress
              percentage={55}
              value={55}
              label="Grasas"
              unit="%"
              color="#DC3714"
            />
          </div>
        </div>
      </div>

      <div className="container pb-24 max-w-md mt-[25px]">

        

        {/* Activity and Hydration Cards - Side by Side */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ActivityCard
            totalCalories={totalCaloriesBurned}
            exercises={exercises}
            onAddClick={() => router.push('/add')}
          />
          <HydrationCard
            totalAmount={totalWater}
            entries={waterEntries}
            onAddClick={() => {/* TODO: Open water modal */}}
          />
        </div>

        {/* Meals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-[#131917] font-semibold text-[24px]">Comidas del día</h3>
            <Link href="/add">
              <button className="w-[38px] h-[38px] rounded-full bg-[#CEFB48] hover:brightness-105 flex items-center justify-center text-[#131917] transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
                <Plus size={20} weight="bold" color="#131917" />
              </button>
            </Link>
          </div>

          <MealCard
            mealType="breakfast"
            calories={meals.breakfast.totalCalories}
            itemCount={meals.breakfast.items.length}
            onClick={() => setSelectedMeal('breakfast')}
          />
          <MealCard
            mealType="lunch"
            calories={meals.lunch.totalCalories}
            itemCount={meals.lunch.items.length}
            onClick={() => setSelectedMeal('lunch')}
          />
          <MealCard
            mealType="dinner"
            calories={meals.dinner.totalCalories}
            itemCount={meals.dinner.items.length}
            onClick={() => setSelectedMeal('dinner')}
          />
          <MealCard
            mealType="snack"
            calories={meals.snack.totalCalories}
            itemCount={meals.snack.items.length}
            onClick={() => setSelectedMeal('snack')}
          />
        </div>
      </div>

      {/* Meal Details Modal */}
      <Modal
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        title={selectedMeal ? `Detalles - ${selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}` : ''}
      >
        {selectedMeal && (
          <div className="space-y-3">
            {meals[selectedMeal as keyof typeof meals].items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay alimentos registrados en esta comida</p>
                <Link href="/add">
                  <Button variant="primary" fullWidth>
                    <Plus size={20} weight="bold" className="mr-2" />
                    Agregar Alimento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-[var(--color-primary-50)] border-2 border-[var(--color-primary-100)] rounded-md p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-bold text-green-600">
                      {meals[selectedMeal as keyof typeof meals].totalCalories} kcal
                    </span>
                  </div>
                </div>
                {meals[selectedMeal as keyof typeof meals].items.map((item: any) => (
                  <div key={item.id} className="bg-[var(--card-bg)] rounded-md p-4 border border-[var(--border-color)]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.brand && <p className="text-xs text-gray-500">{item.brand}</p>}
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="text-red-600">P: {(item.protein * item.quantity / 100).toFixed(1)}g</span>
                          <span className="text-yellow-600">C: {(item.carbs * item.quantity / 100).toFixed(1)}g</span>
                          <span className="text-blue-600">G: {(item.fat * item.quantity / 100).toFixed(1)}g</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Cantidad: {item.quantity}g</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-[var(--primary)]">{Math.round(item.calories * item.quantity / 100)}</p>
                          <p className="text-xs text-gray-500">kcal</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (confirm('¿Eliminar este alimento?')) {
                              await fetch(`/api/logs/delete?id=${item.id}`, { method: 'DELETE' });
                              fetchDashboardData();
                              setSelectedMeal(null);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Minus size={16} weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
