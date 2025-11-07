'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { AchievementCard } from '@/components/ui/AchievementCard';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { Fire, ChartLineUp, X as XIcon, Fish, Grains, Avocado, ListChecks, CalendarBlank, CaretLeft, CaretRight, Clock, WarningCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useModal } from '@/contexts/ModalContext';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { getExerciseIcon } from '@/lib/utils/exerciseIcons';
import { ExerciseCalculationInfo } from '@/components/ui/ExerciseCalculationInfo';
import { StatsSkeleton } from '@/components/ui/Skeleton';

export default function StatsPage() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalFoods, setTotalFoods] = useState(0);
  const [averageCalories, setAverageCalories] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [showWeeklyMealsModal, setShowWeeklyMealsModal] = useState(false);
  const [showExerciseCalculationInfo, setShowExerciseCalculationInfo] = useState(false);
  const [dailyMeals, setDailyMeals] = useState<{ [key: string]: { [mealType: string]: any[] } }>({});
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const { setIsAnyModalOpen } = useModal();
  
  // Actualizar el contexto del modal cuando se abre/cierra
  useEffect(() => {
    setIsAnyModalOpen(!!selectedDay || showWeeklyMealsModal || showExerciseCalculationInfo);
  }, [selectedDay, showWeeklyMealsModal, showExerciseCalculationInfo, setIsAnyModalOpen]);
  
  const handleCloseModal = () => {
    setSelectedDay(null);
  };
  
  const handleCloseWeeklyMealsModal = () => {
    setShowWeeklyMealsModal(false);
  };
  
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

  // Calcular el rango de fechas de la semana
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const startDay = format(weekStart, 'd', { locale: es });
  const endDay = format(weekEnd, 'd', { locale: es });
  const monthYear = format(weekStart, 'MMM yyyy', { locale: es });
  const weekRangeText = `${startDay} al ${endDay} de ${monthYear}`;

  useEffect(() => {
    fetchStats();
    fetchUserName();
  }, [currentWeek]);
  
  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const fetchUserName = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.name) {
          setUserName(data.name);
        }
      } else if (response.status === 401 || response.status === 403) {
        // Si no está autenticado, redirigir al login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Enviar la fecha de inicio de semana a la API
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const response = await fetch(`/api/stats/weekly?weekStart=${weekStartStr}`);
      if (response.ok) {
        const data = await response.json();
        setWeeklyData(data.dailyCalories || []);
        setRecentWorkouts(data.recentWorkouts || []);
        setDailyMeals(data.dailyMeals || {});
        
        // Calcular promedio semanal de calorías
        // Solo considerar días con calorías positivas (o al menos no negativas)
        if (data.dailyCalories && data.dailyCalories.length > 0) {
          const daysWithData = data.dailyCalories.filter((day: any) => day.calories > 0);
          if (daysWithData.length > 0) {
            const totalCalories = daysWithData.reduce((sum: number, day: any) => sum + (day.calories || 0), 0);
            const avg = Math.round(totalCalories / daysWithData.length);
            setAverageCalories(avg);
          } else {
            // Si todos los días tienen 0 o negativo, calcular promedio de todos pero asegurar que no sea negativo
            const totalCalories = data.dailyCalories.reduce((sum: number, day: any) => sum + Math.max(0, day.calories || 0), 0);
            const avg = Math.round(totalCalories / data.dailyCalories.length);
            setAverageCalories(Math.max(0, avg));
          }
        }
        
        // Usar el total real de alimentos registrados de la API
        setTotalFoods(data.totalFoodLogs || 0);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (userName) {
      return userName.substring(0, 2).toUpperCase();
    }
    return 'JD';
  };

  // Componentes personalizados para las barras con iconos
  const FatBarShape = (props: any) => {
    const { x, y, width, height } = props;
    const uniqueId = `fat-${x}-${y}-${width}-${height}`.replace(/[^a-zA-Z0-9]/g, '-');
    const clipId = `clip-fat-${uniqueId}`;
    const marginBottom = 5;
    // Asegurar que height nunca sea negativo
    const safeHeight = Math.max(0, height || 0);
    const adjustedHeight = Math.max(0, safeHeight - marginBottom);
    const radius = 10;
    
    // Si la altura es muy pequeña, usar un rect simple sin border radius
    if (adjustedHeight < radius * 2) {
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={adjustedHeight}
          fill="#DC3714"
        />
      );
    }
    
    // Crear un path con solo las esquinas inferiores redondeadas
    // La barra roja está en la parte inferior, así que y + adjustedHeight es el fondo
    const bottomY = y + adjustedHeight;
    const pathData = `M ${x} ${y} 
                      L ${x + width} ${y} 
                      L ${x + width} ${bottomY - radius} 
                      Q ${x + width} ${bottomY} ${x + width - radius} ${bottomY} 
                      L ${x + radius} ${bottomY} 
                      Q ${x} ${bottomY} ${x} ${bottomY - radius} 
                      Z`;
    
    return (
      <g clipPath={`url(#${clipId})`}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect x={x} y={y} width={width} height={adjustedHeight} />
          </clipPath>
        </defs>
        <path
          d={pathData}
          fill="#DC3714"
        />
        {adjustedHeight > 20 && (
          <foreignObject x={x + width / 2 - 30} y={y + adjustedHeight / 2 - 30} width={60} height={60}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              overflow: 'hidden'
            }}>
              <Avocado 
                weight="bold" 
                style={{ 
                  width: 60, 
                  height: 60,
                  color: 'rgba(255, 255, 255, 0.2)',
                  filter: 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.2))'
                }} 
              />
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  const CarbsBarShape = (props: any) => {
    const { x, y, width, height } = props;
    const clipId = `clip-carbs-${x}-${y}`;
    // Asegurar que height nunca sea negativo
    const safeHeight = Math.max(0, height || 0);
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect x={x} y={y} width={width} height={safeHeight} />
          </clipPath>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={safeHeight}
          fill="#E5C438"
        />
        {safeHeight > 20 && (
          <g clipPath={`url(#${clipId})`}>
            <foreignObject x={x + width / 2 - 30} y={y + safeHeight / 2 - 30} width={60} height={60}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                overflow: 'hidden'
              }}>
                <Grains 
                  weight="bold" 
                  style={{ 
                    width: 60, 
                    height: 60,
                    color: 'rgba(255, 255, 255, 0.2)',
                    filter: 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.2))'
                  }} 
                />
              </div>
            </foreignObject>
          </g>
        )}
      </g>
    );
  };

  const ProteinBarShape = (props: any) => {
    const { x, y, width, height } = props;
    const uniqueId = `protein-${x}-${y}-${width}-${height}`.replace(/[^a-zA-Z0-9]/g, '-');
    const iconClipId = `clip-protein-icon-${uniqueId}`;
    // Asegurar que height nunca sea negativo
    const safeHeight = Math.max(0, height || 0);
    const radius = 10;
    
    // Si la altura es muy pequeña, usar un rect simple sin border radius
    if (safeHeight < radius * 2) {
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={safeHeight}
          fill="#3CCC1F"
        />
      );
    }
    
    // Crear un path con solo las esquinas superiores redondeadas
    // Asegurarse de que el path esté correctamente limitado
    const pathData = `M ${x + radius} ${y} 
                      L ${x + width - radius} ${y} 
                      Q ${x + width} ${y} ${x + width} ${y + radius} 
                      L ${x + width} ${y + safeHeight} 
                      L ${x} ${y + safeHeight} 
                      L ${x} ${y + radius} 
                      Q ${x} ${y} ${x + radius} ${y} Z`;
    
    return (
      <g clipPath={`url(#${iconClipId})`}>
        <defs>
          <clipPath id={iconClipId} clipPathUnits="userSpaceOnUse">
            <rect x={x} y={y} width={width} height={safeHeight} />
          </clipPath>
        </defs>
        <path
          d={pathData}
          fill="#3CCC1F"
        />
        {safeHeight > 20 && (
          <foreignObject x={x + width / 2 - 30} y={y + safeHeight / 2 - 30} width={60} height={60}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              overflow: 'hidden'
            }}>
              <Fish 
                weight="bold" 
                style={{ 
                  width: 60, 
                  height: 60,
                  color: 'rgba(255, 255, 255, 0.2)',
                  filter: 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.2))'
                }} 
              />
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#D9D9D9] pb-24">
      {/* Header oscuro con ícono de perfil y textos */}
      <div className="bg-[#131917] rounded-b-[30px]">
        <div className="px-25 pb-[15px] pt-[40px]">
          <div className="flex items-center gap-4">
            {/* User Avatar with Initials */}
            <Link href="/profile">
              <button className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center text-white hover:opacity-90 transition-colors">
                <span className="font-bold text-xl">{getInitials()}</span>
              </button>
            </Link>

            {/* Título y descripción alineados a la izquierda */}
            <div className="flex-1">
              <h1 className="text-white font-semibold text-xl mb-1">Estadísticas</h1>
              <p className="text-white/70 text-sm">Revisa tu progreso y tendencias</p>
            </div>
          </div>
        </div>
        
        {/* Navegador de semanas en card */}
        <div className="px-6 pb-4">
          <div className="bg-[#404040] rounded-[30px] pt-[15px] pr-[20px] pb-[10px] pl-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CalendarBlank size={20} weight="bold" className="text-[#D9D9D9]" />
                <span className="text-base font-medium text-[#D9D9D9]">
                  {weekRangeText}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousWeek}
                  className="w-7 h-7 rounded-full bg-[#D9D9D9] flex items-center justify-center hover:opacity-90 transition"
                >
                  <CaretLeft size={16} weight="bold" className="text-[#1E1E1E]" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="w-7 h-7 rounded-full bg-[#D9D9D9] flex items-center justify-center hover:opacity-90 transition"
                >
                  <CaretRight size={16} weight="bold" className="text-[#1E1E1E]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-20 max-w-md mx-auto">

        {/* Summary Cards - Diseño igual a la card de kcal en perfil */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Card Promedio Semanal - Oscura como la card de kcal */}
          <div className="bg-[#131917] rounded-[30px] py-[10px] px-[15px] relative overflow-hidden">
            {/* Ícono de fondo */}
            <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(255, 255, 255, 0.2))' }}>
              <Fire weight="bold" className="text-white" style={{ width: 100, height: 85 }} />
            </div>
            {/* Contenido */}
            <div className="relative z-10 flex flex-col justify-center h-full">
              <p className="text-white truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '1' }}>Promedio Semanal</p>
              <div className="flex items-baseline gap-1">
                <p className="text-white leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>{isLoading ? '...' : averageCalories.toLocaleString()}</p>
                <p className="text-white leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>kcal</p>
              </div>
            </div>
      </div>

          {/* Card Total Registrado - Blanca */}
          <div className="bg-white rounded-[30px] py-[10px] px-[15px] relative overflow-hidden shadow-md">
            {/* Ícono de fondo */}
            <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2))' }}>
              <ChartLineUp weight="bold" className="text-[#131917]" style={{ width: 100, height: 85 }} />
            </div>
            {/* Contenido */}
            <div className="relative z-10 flex flex-col justify-center h-full">
              <p className="text-[#131917] truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '1' }}>Total Registrado</p>
              <div className="flex items-baseline gap-1">
                <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>{isLoading ? '...' : totalFoods}</p>
                <p className="text-[#5A5B5A] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>alimentos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - Sin fondo blanco */}
        <div className="mb-6">
          <h3 className="text-[#131917] font-semibold text-lg mb-4">Calorías semanales</h3>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ) : weeklyData.length > 0 ? (
            <>
              <div style={{ outline: 'none' }} tabIndex={-1}>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                  barCategoryGap="15%"
                  style={{ outline: 'none' }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#5A5B5A"
                    tick={{ 
                      fill: '#131917', 
                      fontSize: 14, 
                      fontWeight: 'bold', 
                      fontFamily: 'Quicksand, sans-serif'
                    }}
                    tickLine={{ stroke: '#5A5B5A' }}
                    tickFormatter={(value) => {
                      // Mostrar solo la primera letra del día
                      const dayMap: { [key: string]: string } = {
                        'lun': 'L',
                        'mar': 'M',
                        'mié': 'M',
                        'jue': 'J',
                        'vie': 'V',
                        'sáb': 'S',
                        'dom': 'D'
                      };
                      return dayMap[value.toLowerCase()] || value.charAt(0).toUpperCase();
                    }}
                  />
                  <YAxis 
                    stroke="#5A5B5A"
                    tick={{ fill: '#5A5B5A', fontSize: 12, fontFamily: 'Quicksand, sans-serif' }}
                    tickLine={{ stroke: '#5A5B5A' }}
                    domain={[0, 'dataMax']}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ display: 'none' }}
                    cursor={{ fill: 'transparent' }}
                  />
                  {/* Grasas (rojo) - parte inferior */}
                  <Bar 
                    dataKey="fat" 
                    stackId="a" 
                    fill="#DC3714"
                    radius={[0, 0, 0, 0]}
                    shape={FatBarShape}
                    onClick={(data: any) => {
                      if (data && data.calories > 0) {
                        setSelectedDay(data);
                      }
                    }}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  />
                  {/* Carbohidratos (amarillo) - parte media */}
                  <Bar 
                    dataKey="carbs" 
                    stackId="a" 
                    fill="#E5C438"
                    radius={[0, 0, 0, 0]}
                    shape={CarbsBarShape}
                    onClick={(data: any) => {
                      if (data && data.calories > 0) {
                        setSelectedDay(data);
                      }
                    }}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  />
                  {/* Proteínas (verde) - parte superior */}
                  <Bar 
                    dataKey="protein" 
                    stackId="a" 
                    fill="#3CCC1F"
                    radius={[8, 8, 0, 0]}
                    shape={ProteinBarShape}
                    onClick={(data: any) => {
                      if (data && data.calories > 0) {
                        setSelectedDay(data);
                      }
                    }}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  />
                </BarChart>
          </ResponsiveContainer>
              </div>
              
              {/* Botón para ver todas las comidas */}
              <button 
                onClick={() => setShowWeeklyMealsModal(true)}
                className="w-full bg-[#131917] rounded-[15px] py-2 px-4 flex items-center justify-center gap-2 mt-4"
              >
                <ListChecks size={16} weight="regular" className="text-white" />
                <span className="text-white font-semibold text-base">Ver todas las comidas de la semana</span>
              </button>
              
              {/* Modal de detalles del día seleccionado */}
              {selectedDay && selectedDay.calories > 0 && (() => {
                const dayMeals = dailyMeals[selectedDay.dateStr] || {
                  breakfast: [],
                  lunch: [],
                  dinner: [],
                  snack: []
                };
                const mealLabels: { [key: string]: string } = {
                  breakfast: 'Desayuno',
                  lunch: 'Almuerzo',
                  dinner: 'Cena',
                  snack: 'Snacks'
                };
                
                return (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={handleCloseModal}>
                    <div 
                      className="bg-[#D9D9D9] rounded-[30px] max-w-sm w-full shadow-lg my-8 max-h-[90vh] overflow-hidden flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header con fondo oscuro */}
                      <div className="flex items-center justify-between px-6 py-4 bg-[#131917] rounded-t-[30px] flex-shrink-0">
                        <h4 className="text-white font-semibold text-lg" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                          {selectedDay.date === 'lun' ? 'Lunes' :
                           selectedDay.date === 'mar' ? 'Martes' :
                           selectedDay.date === 'mié' ? 'Miércoles' :
                           selectedDay.date === 'jue' ? 'Jueves' :
                           selectedDay.date === 'vie' ? 'Viernes' :
                           selectedDay.date === 'sáb' ? 'Sábado' :
                           selectedDay.date === 'dom' ? 'Domingo' : selectedDay.date}
                        </h4>
                        <button
                          onClick={handleCloseModal}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#131917] hover:bg-gray-200 transition-colors flex-shrink-0"
                        >
                          <XIcon size={18} weight="bold" />
                        </button>
                      </div>
                      
                      {/* Body con scroll */}
                      <div className="p-6 pb-8 overflow-y-auto flex-1">
                        <div className="space-y-4">
                          {/* Card única con resumen de macros y calorías */}
                          <div className="bg-[#131917] rounded-[20px] p-4">
                            <div className="flex flex-col gap-2">
                              <p className="text-white/70 text-sm">Total del día</p>
                              <div className="flex items-center justify-between gap-3">
                                {/* Sección izquierda: Macros en fila horizontal */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="flex items-center gap-1.5">
                                  <Fish size={18} weight="regular" className="text-[#3CCC1F] flex-shrink-0" />
                                  <span className="text-[#3CCC1F] font-semibold text-sm whitespace-nowrap">
                                    {Math.round(selectedDay.proteinGrams)}g
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Grains size={18} weight="regular" className="text-[#E5C438] flex-shrink-0" />
                                  <span className="text-[#E5C438] font-semibold text-sm whitespace-nowrap">
                                    {Math.round(selectedDay.carbsGrams)}g
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Avocado size={18} weight="regular" className="text-[#DC3714] flex-shrink-0" />
                                  <span className="text-[#DC3714] font-semibold text-sm whitespace-nowrap">
                                    {Math.round(selectedDay.fatGrams)}g
                                  </span>
                                </div>
                                </div>
                                
                                {/* Sección derecha: Calorías totales */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span className="text-white font-bold text-2xl">{selectedDay.calories}</span>
                                  <span className="text-white font-normal text-sm">kcal</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* Comidas del día */}
                        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
                          const mealItems = dayMeals[mealType] || [];
                          if (mealItems.length === 0) return null;
                          
                          const mealTotalCalories = mealItems.reduce((sum: number, item: any) => 
                            sum + Math.round(item.calories * item.quantity), 0
                          );
                          const mealTotalProtein = mealItems.reduce((sum: number, item: any) => 
                            sum + (item.protein * item.quantity), 0
                          );
                          const mealTotalCarbs = mealItems.reduce((sum: number, item: any) => 
                            sum + (item.carbs * item.quantity), 0
                          );
                          const mealTotalFat = mealItems.reduce((sum: number, item: any) => 
                            sum + (item.fat * item.quantity), 0
                          );
                          
                          return (
                            <div key={mealType} className="space-y-3">
                              {/* Header de la comida en una sola línea */}
                              <div>
                                <div className="flex items-center justify-between">
                                  <h5 className="text-[#131917] font-semibold text-base">{mealLabels[mealType]}</h5>
                                  <div className="flex items-center gap-3">
                                    {/* Macros totales */}
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <Fish size={16} weight="bold" className="text-[#3CCC1F]" />
                                        <span className="text-[#131917] text-xs font-semibold">
                                          {Math.round(mealTotalProtein)}g
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Grains size={16} weight="bold" className="text-[#E5C438]" />
                                        <span className="text-[#131917] text-xs font-semibold">
                                          {Math.round(mealTotalCarbs)}g
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Avocado size={16} weight="bold" className="text-[#DC3714]" />
                                        <span className="text-[#131917] text-xs font-semibold">
                                          {Math.round(mealTotalFat)}g
                                        </span>
                                      </div>
                                    </div>
                                    {/* Calorías totales */}
                                    <span className="font-bold text-[#131917]">
                                      {mealTotalCalories} kcal
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Lista de alimentos */}
                              <div className="space-y-2">
                                {mealItems.map((item: any) => {
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
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-[#5A5B5A] text-sm">No hay datos suficientes</p>
          </div>
        )}
        </div>

      {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#131917] font-semibold text-lg mb-4">Entrenamientos recientes</h3>
            
            {/* Card amarilla con total semanal */}
            <div className="bg-[#E5C438]/70 border-2 border-[#E5C438] rounded-[15px] p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#131917] font-semibold">Total semanal:</span>
                <span className="font-bold text-[#131917]">
                  {recentWorkouts.reduce((sum: number, workout: any) => sum + (workout.caloriesBurned || 0), 0)} kcal
                </span>
              </div>
            </div>
            
        <div className="space-y-2">
              {recentWorkouts.map((workout: any) => {
                const ExerciseIcon = getExerciseIcon(workout.icon);
              return (
                  <div key={workout.id} className="bg-[#131917] rounded-[15px] p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Columna izquierda */}
                      <div className="flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <ExerciseIcon size={18} weight="bold" className="text-[#E5C438]" />
                          <p className="text-white font-semibold text-base">{workout.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} weight="bold" className="text-white/70" />
                          <p className="text-white/70 text-xs">Duración: {workout.durationMinutes || 0} min</p>
                        </div>
                      </div>
                      {/* Columna derecha */}
                      <div className="flex flex-col justify-between items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <Fire size={18} weight="bold" className="text-[#DC3714]" />
                          <span className="text-white font-bold text-lg">{workout.caloriesBurned}</span>
                          <span className="text-white/70 text-xs">kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Botón de información sobre cálculo */}
            <button
              onClick={() => setShowExerciseCalculationInfo(true)}
              className="w-full bg-[#6484E2] rounded-[15px] px-4 py-[8px] text-white font-semibold text-[16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
            >
              <WarningCircle size={18} weight="bold" />
              <span>¿Cómo se calculan las calorías?</span>
            </button>
                </div>
        )}
        
        {/* Exercise Calculation Info Modal */}
        <ExerciseCalculationInfo
          isOpen={showExerciseCalculationInfo}
          onClose={() => setShowExerciseCalculationInfo(false)}
        />

      {/* Achievements - Oculto temporalmente */}
      {/* <div>
          <h3 className="text-[#131917] font-semibold text-lg mb-4">Logros Desbloqueados</h3>
          <div className="space-y-3">
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
        </div> */}
      </div>

      {/* Modal de todas las comidas de la semana */}
      {showWeeklyMealsModal && (() => {
        const mealLabels: { [key: string]: string } = {
          breakfast: 'Desayuno',
          lunch: 'Almuerzo',
          dinner: 'Cena',
          snack: 'Snacks'
        };
        
        const dayNames: { [key: string]: string } = {
          'lun': 'Lunes',
          'mar': 'Martes',
          'mié': 'Miércoles',
          'jue': 'Jueves',
          'vie': 'Viernes',
          'sáb': 'Sábado',
          'dom': 'Domingo'
        };
        
        // Obtener los días que tienen comidas, ordenados de lunes a domingo
        const daysWithMeals = weeklyData
          .filter(day => {
            const dayMeals = dailyMeals[day.dateStr] || {};
            return Object.values(dayMeals).some(meals => meals.length > 0);
          })
          .sort((a, b) => {
            const dayOrder = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
            return dayOrder.indexOf(a.date) - dayOrder.indexOf(b.date);
          });
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={handleCloseWeeklyMealsModal}>
            <div 
              className="bg-[#D9D9D9] rounded-[30px] max-w-sm w-full shadow-lg my-8 max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con fondo oscuro */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#131917] rounded-t-[30px] flex-shrink-0">
                <h4 className="text-white font-semibold text-lg" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                  Comidas de la Semana
                </h4>
                <button
                  onClick={handleCloseWeeklyMealsModal}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#131917] hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <XIcon size={18} weight="bold" />
                </button>
              </div>
              
              {/* Body con scroll */}
              <div className="p-6 pb-8 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {daysWithMeals.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#5A5B5A] text-sm">No hay comidas registradas esta semana</p>
                    </div>
                  ) : (
                    <>
                      {/* Card única con resumen de macros y calorías de la semana completa */}
                      {(() => {
                        // Calcular totales de toda la semana
                        let weekTotalProtein = 0, weekTotalCarbs = 0, weekTotalFat = 0, weekTotalCalories = 0;
                        daysWithMeals.forEach((day) => {
                          const dayMeals = dailyMeals[day.dateStr] || {};
                          Object.values(dayMeals).forEach((mealItems: any[]) => {
                            mealItems.forEach((item: any) => {
                              weekTotalProtein += item.protein * item.quantity;
                              weekTotalCarbs += item.carbs * item.quantity;
                              weekTotalFat += item.fat * item.quantity;
                              weekTotalCalories += item.calories * item.quantity;
                            });
                          });
                        });
                        
                        return (
                          <div className="bg-[#131917] rounded-[20px] p-4">
                            <div className="flex flex-col gap-2">
                              <p className="text-white/70 text-sm">Total de la semana</p>
                              <div className="flex items-center justify-between gap-3">
                                {/* Sección izquierda: Macros en fila horizontal */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="flex items-center gap-1.5">
                                    <Fish size={18} weight="regular" className="text-[#3CCC1F] flex-shrink-0" />
                                    <span className="text-[#3CCC1F] font-semibold text-sm whitespace-nowrap">
                                      {Math.round(weekTotalProtein)}g
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Grains size={18} weight="regular" className="text-[#E5C438] flex-shrink-0" />
                                    <span className="text-[#E5C438] font-semibold text-sm whitespace-nowrap">
                                      {Math.round(weekTotalCarbs)}g
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Avocado size={18} weight="regular" className="text-[#DC3714] flex-shrink-0" />
                                    <span className="text-[#DC3714] font-semibold text-sm whitespace-nowrap">
                                      {Math.round(weekTotalFat)}g
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Sección derecha: Calorías totales */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span className="text-white font-bold text-2xl">{Math.round(weekTotalCalories)}</span>
                                  <span className="text-white font-normal text-sm">kcal</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* Días con comidas */}
                      {daysWithMeals.map((day) => {
                        const dayMeals = dailyMeals[day.dateStr] || {
                          breakfast: [],
                          lunch: [],
                          dinner: [],
                          snack: []
                        };
                        
                        // Calcular totales del día
                        let dayTotalProtein = 0, dayTotalCarbs = 0, dayTotalFat = 0, dayTotalCalories = 0;
                        Object.values(dayMeals).forEach((mealItems: any[]) => {
                          mealItems.forEach((item: any) => {
                            dayTotalProtein += item.protein * item.quantity;
                            dayTotalCarbs += item.carbs * item.quantity;
                            dayTotalFat += item.fat * item.quantity;
                            dayTotalCalories += item.calories * item.quantity;
                          });
                        });
                        
                        // Obtener todas las comidas del día sin separar por tipo
                        const allDayMeals: any[] = [];
                        Object.values(dayMeals).forEach((mealItems: any[]) => {
                          allDayMeals.push(...mealItems);
                        });
                        
                        return (
                          <div key={day.dateStr} className="space-y-3">
                            {/* Header del día en una sola línea */}
                            <div>
                              <div className="flex items-center justify-between">
                                <h5 className="text-[#131917] font-semibold text-base">{dayNames[day.date] || day.date}</h5>
                                <div className="flex items-center gap-3">
                                  {/* Macros totales */}
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Fish size={16} weight="bold" className="text-[#3CCC1F]" />
                                      <span className="text-[#131917] text-xs font-semibold">
                                        {Math.round(dayTotalProtein)}g
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Grains size={16} weight="bold" className="text-[#E5C438]" />
                                      <span className="text-[#131917] text-xs font-semibold">
                                        {Math.round(dayTotalCarbs)}g
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Avocado size={16} weight="bold" className="text-[#DC3714]" />
                                      <span className="text-[#131917] text-xs font-semibold">
                                        {Math.round(dayTotalFat)}g
                                      </span>
                                    </div>
                                  </div>
                                  {/* Calorías totales */}
                                  <span className="font-bold text-[#131917]">
                                    {Math.round(dayTotalCalories)} kcal
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Lista de todas las comidas del día */}
                            <div className="space-y-2">
                              {allDayMeals.map((item: any) => {
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
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bottom Navigation - oculto cuando el modal está abierto */}
      {!selectedDay && !showWeeklyMealsModal && !showExerciseCalculationInfo && <BottomNav />}
    </div>
  );
}

