import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises, userStreaks, userProfiles, waterLogs, users } from '@/lib/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { getTodayDateLocal, formatDateLocal } from '@/lib/utils/date';
import { format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener la fecha del query string, o usar la fecha actual si no se especifica
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    
    let targetDate: string;
    if (dateParam) {
      // Validar formato de fecha YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(dateParam)) {
        targetDate = dateParam;
      } else {
        // Si el formato es inválido, intentar parsear como Date
        try {
          const parsedDate = new Date(dateParam);
          if (!isNaN(parsedDate.getTime())) {
            targetDate = formatDateLocal(parsedDate);
          } else {
            targetDate = getTodayDateLocal();
          }
        } catch {
          targetDate = getTodayDateLocal();
        }
      }
    } else {
      targetDate = getTodayDateLocal();
    }

    const today = targetDate;
    
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

    // Get user profile with targets
    const profileData = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const targets = profileData.length > 0 ? {
      targetCalories: profileData[0].targetCalories ?? 2000,
      targetProtein: profileData[0].targetProtein ?? 150,
      targetCarbs: profileData[0].targetCarbs ?? 250,
      targetFat: profileData[0].targetFat ?? 67,
    } : {
      targetCalories: 2000,
      targetProtein: 150,
      targetCarbs: 250,
      targetFat: 67,
    };

    // Get water logs for today
    const todayWaterLogs = await db
      .select()
      .from(waterLogs)
      .where(and(
        eq(waterLogs.userId, user.id),
        eq(waterLogs.date, today)
      ));

    const totalWater = todayWaterLogs.reduce((sum, log) => sum + log.amount, 0);

    // Format water entries for display
    const waterEntries = todayWaterLogs.map(log => ({
      id: log.id,
      amount: log.amount,
      time: format(new Date(log.createdAt), 'HH:mm'),
    }));

    // Get user name
    const userData = await db
      .select({
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const userName = userData.length > 0 ? userData[0].name : null;

    return NextResponse.json({
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
      },
      targets,
      meals,
      exercises: todayExercises,
      totalCaloriesBurned,
      streak,
      totalWater,
      waterEntries,
      userName,
    });
  } catch (error: any) {
    console.error('Error en dashboard API:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos', details: error.message },
      { status: 500 }
    );
  }
}

