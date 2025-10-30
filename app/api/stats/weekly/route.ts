import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises } from '@/lib/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Get data for the last 7 days
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch food logs with foods
    const logs = await db
      .select({
        id: foodLogs.id,
        date: foodLogs.date,
        mealType: foodLogs.mealType,
        quantity: foodLogs.quantity,
        food: foods,
      })
      .from(foodLogs)
      .innerJoin(foods, eq(foodLogs.foodId, foods.id))
      .where(
        and(
          eq(foodLogs.userId, user.id),
          gte(foodLogs.date, sevenDaysAgo.toISOString()),
          lte(foodLogs.date, today.toISOString())
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
          gte(exercises.date, sevenDaysAgo.toISOString()),
          lte(exercises.date, today.toISOString())
        )
      )
      .orderBy(desc(exercises.date));

    // Calculate calories per day
    const dailyCalories: { [key: string]: number } = {};
    
    logs.forEach((log) => {
      const date = log.date.split('T')[0];
      const calories = (log.food.calories * log.quantity) / 100;
      dailyCalories[date] = (dailyCalories[date] || 0) + calories;
    });

    exercisesData.forEach((ex) => {
      const date = ex.date.split('T')[0];
      dailyCalories[date] = (dailyCalories[date] || 0) - ex.caloriesBurned;
    });

    // Generate data for the last 7 days
    const chartData = [];
    const macrosData: { [key: string]: { protein: number; carbs: number; fat: number } } = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });

      // Calculate macros for this day
      let protein = 0, carbs = 0, fat = 0;
      
      const dayLogs = logs.filter((log) => log.date.startsWith(dateStr));
      dayLogs.forEach((log) => {
        const multiplier = log.quantity / 100;
        protein += log.food.protein * multiplier;
        carbs += log.food.carbs * multiplier;
        fat += log.food.fat * multiplier;
      });

      macrosData[dateStr] = { protein, carbs, fat };

      chartData.push({
        date: dayName,
        calories: Math.round(dailyCalories[dateStr] || 0),
      });
    }

    // Get latest completed workouts (all time)
    const recentWorkouts = await db
      .select()
      .from(exercises)
      .where(eq(exercises.userId, user.id))
      .orderBy(desc(exercises.date))
      .limit(5);

    return NextResponse.json({
      dailyCalories: chartData,
      macros: macrosData,
      recentWorkouts,
    });
  } catch (error: any) {
    console.error('Error fetching weekly stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas', details: error.message },
      { status: 500 }
    );
  }
}

