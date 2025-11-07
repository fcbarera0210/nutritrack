import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises } from '@/lib/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { formatDateLocal } from '@/lib/utils/date';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Get data for the specified week (Monday to Sunday)
    const { searchParams } = new URL(req.url);
    const weekStartParam = searchParams.get('weekStart');
    
    let monday: Date;
    if (weekStartParam) {
      // Usar la fecha proporcionada (formato YYYY-MM-DD)
      const [year, month, day] = weekStartParam.split('-').map(Number);
      monday = new Date(year, month - 1, day);
    } else {
      // Si no se proporciona, usar la semana actual
      const today = new Date();
      const currentDay = today.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      monday = new Date(today);
      monday.setDate(monday.getDate() - daysFromMonday);
    }
    
    // Obtener fechas en formato YYYY-MM-DD para las consultas
    const mondayStr = formatDateLocal(monday);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const sundayStr = formatDateLocal(sunday);

    // Fetch food logs with foods (including servingSize and servingUnit)
    const logs = await db
      .select({
        id: foodLogs.id,
        date: foodLogs.date,
        mealType: foodLogs.mealType,
        quantity: foodLogs.quantity,
        servingSize: foodLogs.servingSize,
        food: foods,
      })
      .from(foodLogs)
      .innerJoin(foods, eq(foodLogs.foodId, foods.id))
      .where(
        and(
          eq(foodLogs.userId, user.id),
          gte(foodLogs.date, mondayStr),
          lte(foodLogs.date, sundayStr)
        )
      )
      .orderBy(desc(foodLogs.date));

    // Fetch exercises
    const exercisesData = await db
      .select()
      .from(exercises)
      .where(
        and(
          eq(exercises.userId, user.id),
          gte(exercises.date, mondayStr),
          lte(exercises.date, sundayStr)
        )
      )
      .orderBy(desc(exercises.date));

    // Calculate calories per day
    const dailyCalories: { [key: string]: number } = {};
    
    // Helper function to extract date string from log.date (could be Date object or string)
    const getDateStr = (dateValue: any): string => {
      if (dateValue instanceof Date) {
        return formatDateLocal(dateValue);
      }
      if (typeof dateValue === 'string') {
        return dateValue.split('T')[0];
      }
      return String(dateValue).split('T')[0];
    };
    
    // quantity is a multiplier for servingSize, so we calculate calories as: calories * quantity
    logs.forEach((log) => {
      const date = getDateStr(log.date);
      const calories = log.food.calories * log.quantity;
      dailyCalories[date] = (dailyCalories[date] || 0) + calories;
    });

    // Subtract calories burned from exercises
    exercisesData.forEach((ex) => {
      const date = getDateStr(ex.date);
      dailyCalories[date] = (dailyCalories[date] || 0) - ex.caloriesBurned;
    });

    // Generate data for Monday to Sunday (current week)
    const chartData = [];
    const macrosData: { [key: string]: { protein: number; carbs: number; fat: number } } = {};
    const dailyMeals: { [key: string]: { [mealType: string]: any[] } } = {};

    // Generate data from Monday to Sunday
    const dayNames = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + i);
      const dateStr = formatDateLocal(date);
      const dayName = dayNames[i];

      // Calculate macros for this day and group meals
      // quantity is a multiplier of servingSize, so we calculate macros as: macro * quantity
      let protein = 0, carbs = 0, fat = 0;
      
      // Extraer solo la fecha (YYYY-MM-DD) de log.date para comparar correctamente
      const dayLogs = logs.filter((log) => {
        const logDateStr = getDateStr(log.date);
        return logDateStr === dateStr;
      });
      
      // Group logs by meal type
      const mealsByType: { [mealType: string]: any[] } = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      };
      
      dayLogs.forEach((log) => {
        const multiplier = log.quantity; // quantity is already the multiplier
        protein += log.food.protein * multiplier;
        carbs += log.food.carbs * multiplier;
        fat += log.food.fat * multiplier;
        
        // Add to meals by type
        mealsByType[log.mealType].push({
          id: log.id,
          name: log.food.name,
          calories: log.food.calories,
          protein: log.food.protein,
          carbs: log.food.carbs,
          fat: log.food.fat,
          quantity: log.quantity,
          servingSize: log.servingSize,
          servingUnit: log.food.servingUnit || 'g',
        });
      });

      macrosData[dateStr] = { protein, carbs, fat };
      dailyMeals[dateStr] = mealsByType;

      // Calculate calories from macros for the bar chart
      // Each gram of protein/carbs = 4 kcal, each gram of fat = 9 kcal
      const proteinCalories = protein * 4;
      const carbsCalories = carbs * 4;
      const fatCalories = fat * 9;
      const totalCalories = Math.max(0, Math.round(dailyCalories[dateStr] || 0));

      chartData.push({
        date: dayName,
        dateStr: dateStr,
        calories: totalCalories,
        protein: Math.round(proteinCalories),
        carbs: Math.round(carbsCalories),
        fat: Math.round(fatCalories),
        proteinGrams: Math.round(protein),
        carbsGrams: Math.round(carbs),
        fatGrams: Math.round(fat),
      });
    }

    // Get latest completed workouts (all time)
    const recentWorkouts = await db
      .select()
      .from(exercises)
      .where(eq(exercises.userId, user.id))
      .orderBy(desc(exercises.date))
      .limit(5);

    // Count total food logs in the last 7 days
    const totalFoodLogs = logs.length;

    return NextResponse.json({
      dailyCalories: chartData,
      macros: macrosData,
      recentWorkouts,
      totalFoodLogs,
      dailyMeals,
    });
  } catch (error: any) {
    console.error('Error fetching weekly stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas', details: error.message },
      { status: 500 }
    );
  }
}

