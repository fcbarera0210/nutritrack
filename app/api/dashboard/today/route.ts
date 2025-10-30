import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises, userStreaks } from '@/lib/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { format } from 'date-fns';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Get today's food logs with food details
    const todayLogs = await db
      .select({
        id: foodLogs.id,
        quantity: foodLogs.quantity,
        servingSize: foodLogs.servingSize,
        mealType: foodLogs.mealType,
        name: foods.name,
        calories: foods.calories,
        protein: foods.protein,
        carbs: foods.carbs,
        fat: foods.fat,
        brand: foods.brand,
      })
      .from(foodLogs)
      .innerJoin(foods, eq(foodLogs.foodId, foods.id))
      .where(and(
        eq(foodLogs.userId, user.id),
        eq(foodLogs.date, today)
      ));

    // Calculate totals
    const totals = todayLogs.reduce((acc, log) => {
      // Calories and macros are per 100g, so we calculate based on quantity
      const multiplier = log.quantity / 100;
      acc.calories += log.calories * multiplier;
      acc.protein += log.protein * multiplier;
      acc.carbs += log.carbs * multiplier;
      acc.fat += log.fat * multiplier;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Group by meal type and calculate totals for each meal
    const meals = {
      breakfast: {
        items: todayLogs.filter(log => log.mealType === 'breakfast'),
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      },
      lunch: {
        items: todayLogs.filter(log => log.mealType === 'lunch'),
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      },
      dinner: {
        items: todayLogs.filter(log => log.mealType === 'dinner'),
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      },
      snack: {
        items: todayLogs.filter(log => log.mealType === 'snack'),
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      },
    };

    // Calculate totals for each meal type
    Object.keys(meals).forEach(mealType => {
      const meal = meals[mealType as keyof typeof meals];
      meal.items.forEach(log => {
        const multiplier = log.quantity / 100;
        meal.totalCalories += log.calories * multiplier;
        meal.totalProtein += log.protein * multiplier;
        meal.totalCarbs += log.carbs * multiplier;
        meal.totalFat += log.fat * multiplier;
      });
      meal.totalCalories = Math.round(meal.totalCalories);
      meal.totalProtein = Math.round(meal.totalProtein * 10) / 10;
      meal.totalCarbs = Math.round(meal.totalCarbs * 10) / 10;
      meal.totalFat = Math.round(meal.totalFat * 10) / 10;
    });

    // Get exercise logs for today
    const todayExercises = await db
      .select()
      .from(exercises)
      .where(and(
        eq(exercises.userId, user.id),
        eq(exercises.date, today)
      ));

    const totalCaloriesBurned = todayExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

    // Get user streak
    const streakData = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, user.id))
      .limit(1);

    const streak = streakData.length > 0 ? streakData[0].currentStreak : 0;

    return NextResponse.json({
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
      },
      meals,
      exercises: todayExercises,
      totalCaloriesBurned,
      streak,
    });
  } catch (error: any) {
    console.error('Error en dashboard API:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos', details: error.message },
      { status: 500 }
    );
  }
}

