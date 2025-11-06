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
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { HydrationForm } from '@/components/forms/HydrationForm';
import { ExerciseForm } from '@/components/forms/ExerciseForm';
import { ExerciseCalculationInfo } from '@/components/ui/ExerciseCalculationInfo';
import { getExerciseIcon } from '@/lib/utils/exerciseIcons';
import { formatDateLocal } from '@/lib/utils/date';
import { Fire, Plus, Trash, Fish, Grains, Avocado, Clock, WarningCircle } from '@phosphor-icons/react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showExercisesListModal, setShowExercisesListModal] = useState(false);
  const [showExerciseCalculationInfo, setShowExerciseCalculationInfo] = useState(false);
  
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
  const [streakDays, setStreakDays] = useState<Date[]>([]);
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
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Formatear la fecha seleccionada a YYYY-MM-DD usando la función helper para evitar problemas de zona horaria
      const dateStr = formatDateLocal(selectedDate);
      const response = await fetch(`/api/dashboard/today?date=${dateStr}`);
      const data = await response.json();
      
      if (response.ok) {
        setTodayStats({
          calories: data.totals?.calories || 0,
          protein: data.totals?.protein || 0,
          carbs: data.totals?.carbs || 0,
          fat: data.totals?.fat || 0,
          targetCalories: data.targets?.targetCalories || 2000,
          targetProtein: data.targets?.targetProtein || 150,
          targetCarbs: data.targets?.targetCarbs || 250,
          targetFat: data.targets?.targetFat || 67,
        });
        setStreak(data.streak || 0);
        // Convertir fechas string a Date objects para streakDays
        if (data.streakDays && Array.isArray(data.streakDays)) {
          const dates = data.streakDays.map((dateStr: string) => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
          });
          setStreakDays(dates);
        } else {
          setStreakDays([]);
        }
        setMeals(data.meals || {
          breakfast: { totalCalories: 0, items: [] },
          lunch: { totalCalories: 0, items: [] },
          dinner: { totalCalories: 0, items: [] },
          snack: { totalCalories: 0, items: [] },
        });
        setExercises(data.exercises || []);
        setTotalCaloriesBurned(data.totalCaloriesBurned || 0);
        setWaterEntries(data.waterEntries || []);
        setTotalWater(data.totalWater || 0);
        setUserName(data.userName || null);
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

  const proteinProgress = (todayStats.protein / todayStats.targetProtein) * 100;
  const carbsProgress = (todayStats.carbs / todayStats.targetCarbs) * 100;
  const fatProgress = (todayStats.fat / todayStats.targetFat) * 100;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {isLoading ? (
        <>
          <DashboardSkeleton />
          <BottomNav />
        </>
      ) : (
        <>
          {/* Header + dark section wrapper */}
          <div className="bg-[#131917] rounded-b-[60px]">
            <div className="px-25 pb-[15px] flex flex-col gap-[30px]">
              <div>
                <Header userName={userName || undefined} />
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
                {/* Mensaje de rachas - Solo visible cuando hay 3+ días */}
                {streak >= 3 && (
                  <div className="flex items-center gap-2 mb-[5px]">
                    <Fire size={21} weight="bold" className="text-[#DC3714]" />
                    <p className="text-white text-[14px] font-medium">Llevas {streak} días de racha, sigue así !!</p>
                  </div>
                )}
                <div className="text-white text-[36px] font-semibold">
                  {todayStats.calories} / {todayStats.targetCalories} kcal
                </div>
                <div className="text-white/80 text-[14px] mt-1">
                  {Math.round((todayStats.calories / todayStats.targetCalories) * 100)}% del objetivo
                </div>
              </div>

              {/* Circular Macros (inside dark box) */}
              <div className="grid grid-cols-3 gap-4">
                <CircularProgress
                  percentage={Math.min(proteinProgress, 100)}
                  value={todayStats.protein}
                  label="Proteínas"
                  unit="g"
                  color="#3CCC1F"
                />
                <CircularProgress
                  percentage={Math.min(carbsProgress, 100)}
                  value={todayStats.carbs}
                  label="Carbohidratos"
                  unit="g"
                  color="#E5C438"
                />
                <CircularProgress
                  percentage={Math.min(fatProgress, 100)}
                  value={todayStats.fat}
                  label="Grasas"
                  unit="g"
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
                onAddClick={() => setShowExerciseModal(true)}
                onClick={() => setShowExercisesListModal(true)}
              />
              <HydrationCard
                totalAmount={totalWater}
                entries={waterEntries}
                onAddClick={() => setShowHydrationModal(true)}
              />
            </div>

            {/* Meals Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="text-[#131917] font-semibold text-[24px]">Comidas del día</h3>
              </div>

              <MealCard
                mealType="breakfast"
                calories={meals.breakfast.totalCalories}
                itemCount={meals.breakfast.items.length}
                items={meals.breakfast.items}
                onClick={() => setSelectedMeal('breakfast')}
              />
              <MealCard
                mealType="lunch"
                calories={meals.lunch.totalCalories}
                itemCount={meals.lunch.items.length}
                items={meals.lunch.items}
                onClick={() => setSelectedMeal('lunch')}
              />
              <MealCard
                mealType="dinner"
                calories={meals.dinner.totalCalories}
                itemCount={meals.dinner.items.length}
                items={meals.dinner.items}
                onClick={() => setSelectedMeal('dinner')}
              />
              <MealCard
                mealType="snack"
                calories={meals.snack.totalCalories}
                itemCount={meals.snack.items.length}
                items={meals.snack.items}
                onClick={() => setSelectedMeal('snack')}
              />
            </div>
          </div>

          {/* Meal Details Modal */}
          <Modal
            isOpen={!!selectedMeal}
            onClose={() => setSelectedMeal(null)}
            title={selectedMeal ? `Detalles - ${selectedMeal === 'breakfast' ? 'Desayuno' : selectedMeal === 'lunch' ? 'Almuerzo' : selectedMeal === 'dinner' ? 'Cena' : 'Snacks'}` : ''}
          >
            {selectedMeal && (
              <div className="space-y-3">
                {meals[selectedMeal as keyof typeof meals].items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No hay alimentos registrados en esta comida</p>
                    <Link href="/add" className="flex justify-center">
                      <button className="bg-[#3CCC1F]/70 border-2 border-[#3CCC1F] rounded-[15px] px-4 py-[10px] text-[#131917] font-semibold text-[16px] hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                        <Plus size={20} weight="bold" />
                        <span>Agregar Alimento</span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-[#3CCC1F]/70 border-2 border-[#3CCC1F] rounded-[15px] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#131917] font-semibold">Total:</span>
                        <div className="flex items-center gap-3">
                          {/* Macros totales */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Fish size={16} weight="bold" className="text-[#131917]" />
                              <span className="text-[#131917] text-xs font-semibold">
                                {Math.round((meals[selectedMeal as keyof typeof meals].items.reduce((sum: number, item: any) => sum + (item.protein * item.quantity), 0)) * 10) / 10}g
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Grains size={16} weight="bold" className="text-[#131917]" />
                              <span className="text-[#131917] text-xs font-semibold">
                                {Math.round((meals[selectedMeal as keyof typeof meals].items.reduce((sum: number, item: any) => sum + (item.carbs * item.quantity), 0)) * 10) / 10}g
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Avocado size={16} weight="bold" className="text-[#131917]" />
                              <span className="text-[#131917] text-xs font-semibold">
                                {Math.round((meals[selectedMeal as keyof typeof meals].items.reduce((sum: number, item: any) => sum + (item.fat * item.quantity), 0)) * 10) / 10}g
                              </span>
                            </div>
                          </div>
                          {/* Calorías totales */}
                          <span className="font-bold text-[#131917]">
                            {meals[selectedMeal as keyof typeof meals].totalCalories} kcal
                          </span>
                        </div>
                      </div>
                    </div>
                    {meals[selectedMeal as keyof typeof meals].items.map((item: any) => {
                      // quantity is a multiplier of servingSize, so actual amount is quantity * servingSize
                      const actualQuantity = item.quantity * (item.servingSize || 100);
                      const servingUnit = item.servingUnit || 'g';
                      const itemProtein = Math.round((item.protein * item.quantity) * 10) / 10;
                      const itemCarbs = Math.round((item.carbs * item.quantity) * 10) / 10;
                      const itemFat = Math.round((item.fat * item.quantity) * 10) / 10;
                      const itemCalories = Math.round(item.calories * item.quantity);
                      
                      // Helper para formatear la unidad
                      const formatUnit = (unit: string) => {
                        if (unit === 'g') return 'g';
                        if (unit === 'ml') return 'ml';
                        if (unit === 'unit') return ' unidad' + (actualQuantity !== 1 ? 'es' : '');
                        return 'g';
                      };
                      
                      return (
                        <div key={item.id} className="bg-[#131917] rounded-[15px] p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Columna izquierda */}
                            <div className="flex flex-col justify-between">
                              <p className="text-white font-semibold text-base mb-2">{item.name}</p>
                              <p className="text-white/70 text-xs">Cantidad: {actualQuantity}{formatUnit(servingUnit)}</p>
                            </div>
                            {/* Columna derecha */}
                            <div className="flex flex-col justify-between items-end">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-white font-bold text-lg">{itemCalories}</span>
                                <span className="text-white/70 text-xs">kcal</span>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm('¿Eliminar este alimento?')) {
                                      await fetch(`/api/logs/delete?id=${item.id}`, { method: 'DELETE' });
                                      fetchDashboardData();
                                      setSelectedMeal(null);
                                    }
                                  }}
                                  className="ml-2 text-white/70 hover:text-[#DC3714] transition-colors"
                                >
                                  <Trash size={16} weight="bold" />
                                </button>
                              </div>
                              {/* Macros */}
                              <div className="flex items-center gap-2">
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
                      );
                    })}
                    {/* Botón para agregar comida al final de la lista */}
                    <div className="pt-2">
                      <Link href="/add" className="flex justify-center">
                        <button className="w-full bg-[#3CCC1F]/70 border-2 border-[#3CCC1F] rounded-[15px] px-4 py-[10px] text-[#131917] font-semibold text-[16px] hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
                          <Plus size={20} weight="bold" />
                          <span>Agregar Alimento</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal>

          {/* Hydration Modal */}
          <Modal
            isOpen={showHydrationModal}
            onClose={() => setShowHydrationModal(false)}
            title="Agregar Hidratación"
          >
            <HydrationForm
              onSuccess={() => {
                setShowHydrationModal(false);
                fetchDashboardData();
              }}
              onCancel={() => setShowHydrationModal(false)}
            />
          </Modal>

          {/* Exercise Modal */}
          <Modal
            isOpen={showExerciseModal}
            onClose={() => setShowExerciseModal(false)}
            title="Registrar Ejercicio"
          >
            <ExerciseForm
              onSuccess={async () => {
                setShowExerciseModal(false);
                // Esperar un momento para que la base de datos se actualice
                await new Promise(resolve => setTimeout(resolve, 100));
                await fetchDashboardData();
              }}
              onCancel={() => setShowExerciseModal(false)}
            />
          </Modal>

          {/* Exercises List Modal */}
          <Modal
            isOpen={showExercisesListModal}
            onClose={() => setShowExercisesListModal(false)}
            title="Ejercicios del día"
          >
            <div className="space-y-3">
              {exercises.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No hay ejercicios registrados hoy</p>
                  <button
                    onClick={() => {
                      setShowExercisesListModal(false);
                      setShowExerciseModal(true);
                    }}
                    className="bg-[#E5C438]/70 border-2 border-[#E5C438] rounded-[15px] px-4 py-[10px] text-[#131917] font-semibold text-[16px] hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  >
                    <Plus size={20} weight="bold" />
                    <span>Agregar Ejercicio</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-[#E5C438]/70 border-2 border-[#E5C438] rounded-[15px] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#131917] font-semibold">Total:</span>
                      <span className="font-bold text-[#131917]">
                        {totalCaloriesBurned} kcal
                      </span>
                    </div>
                  </div>
                  {exercises.map((exercise: any) => {
                    const ExerciseIcon = getExerciseIcon(exercise.icon);
                    return (
                      <div key={exercise.id} className="bg-[#131917] rounded-[15px] p-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Columna izquierda */}
                          <div className="flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                              <ExerciseIcon size={18} weight="bold" className="text-[#E5C438]" />
                              <p className="text-white font-semibold text-base">{exercise.name}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} weight="bold" className="text-white/70" />
                              <p className="text-white/70 text-xs">Duración: {exercise.durationMinutes} min</p>
                            </div>
                          </div>
                          {/* Columna derecha */}
                          <div className="flex flex-col justify-between items-end">
                            <div className="flex items-center gap-2 mb-2">
                              <Fire size={18} weight="bold" className="text-[#DC3714]" />
                              <span className="text-white font-bold text-lg">{exercise.caloriesBurned}</span>
                              <span className="text-white/70 text-xs">kcal</span>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (confirm('¿Eliminar este ejercicio?')) {
                                    await fetch(`/api/exercises/delete?id=${exercise.id}`, { method: 'DELETE' });
                                    fetchDashboardData();
                                  }
                                }}
                                className="ml-2 text-white/70 hover:text-[#DC3714] transition-colors"
                              >
                                <Trash size={16} weight="bold" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Botón de información sobre cálculo */}
              <button
                onClick={() => setShowExerciseCalculationInfo(true)}
                className="w-full bg-[#6484E2] rounded-[15px] px-4 py-[8px] text-white font-semibold text-[16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
              >
                <WarningCircle size={18} weight="bold" />
                <span>¿Cómo se calculan las calorías?</span>
              </button>
            </div>
          </Modal>

          {/* Exercise Calculation Info Modal */}
          <ExerciseCalculationInfo
            isOpen={showExerciseCalculationInfo}
            onClose={() => setShowExerciseCalculationInfo(false)}
          />

          {/* Bottom Navigation */}
          <BottomNav />
        </>
      )}
    </div>
  );
}
