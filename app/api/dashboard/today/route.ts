import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises, userStreaks, userProfiles, waterLogs, users } from '@/lib/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { getTodayDateLocal, formatDateLocal, formatTimeChile } from '@/lib/utils/date';

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
        foodId: foodLogs.foodId,
        quantity: foodLogs.quantity,
        servingSize: foodLogs.servingSize,
        mealType: foodLogs.mealType,
        date: foodLogs.date,
        name: foods.name,
        calories: foods.calories,
        protein: foods.protein,
        carbs: foods.carbs,
        fat: foods.fat,
        brand: foods.brand,
        servingUnit: foods.servingUnit,
      })
      .from(foodLogs)
      .innerJoin(foods, eq(foodLogs.foodId, foods.id))
      .where(and(
        eq(foodLogs.userId, user.id),
        eq(foodLogs.date, today)
      ));

    // Calculate totals
    const totals = todayLogs.reduce((acc, log) => {
      // quantity is a multiplier of servingSize, so we calculate based on that
      const multiplier = log.quantity; // quantity is already the multiplier
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
        // quantity is already the multiplier of servingSize
        const multiplier = log.quantity;
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

    // Get all dates with logged food or exercise (for streak visualization)
    // Obtener fechas únicas de los últimos 30 días donde hay comida o ejercicio
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = formatDateLocal(thirtyDaysAgo);

    // Obtener todas las fechas de comidas (luego filtrar únicas en JS)
    const allFoodLogs = await db
      .select({ date: foodLogs.date })
      .from(foodLogs)
      .where(
        and(
          eq(foodLogs.userId, user.id),
          gte(foodLogs.date, thirtyDaysAgoStr)
        )
      );

    // Obtener todas las fechas de ejercicios (luego filtrar únicas en JS)
    const allExerciseLogs = await db
      .select({ date: exercises.date })
      .from(exercises)
      .where(
        and(
          eq(exercises.userId, user.id),
          gte(exercises.date, thirtyDaysAgoStr)
        )
      );

    // Combinar y obtener fechas únicas
    const allDates = new Set<string>();
    allFoodLogs.forEach(item => allDates.add(item.date));
    allExerciseLogs.forEach(item => allDates.add(item.date));
    
    // Calcular días consecutivos desde hoy hacia atrás
    const currentDate = getTodayDateLocal();
    const sortedDates = Array.from(allDates).sort().reverse(); // Ordenar de más reciente a más antiguo
    
    // Calcular racha consecutiva desde hoy
    let consecutiveStreak = 0;
    const consecutiveStreakDays: string[] = [];
    const todayDate = new Date(currentDate + 'T00:00:00');
    
    for (let i = 0; i < 30; i++) { // Revisar hasta 30 días hacia atrás
      const checkDate = new Date(todayDate);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = formatDateLocal(checkDate);
      
      if (sortedDates.includes(checkDateStr)) {
        consecutiveStreak++;
        consecutiveStreakDays.push(checkDateStr);
      } else {
        // Si encontramos un día sin registro, la racha se rompe
        break;
      }
    }
    
    // Solo devolver días consecutivos para el calendario
    const streakDays = consecutiveStreakDays;
    
    // Calcular racha: solo mostrar si hay 3+ días consecutivos
    const streak = consecutiveStreak >= 3 ? consecutiveStreak : 0;

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
    // Usar formatTimeChile para convertir correctamente de UTC a la zona horaria de Chile
    const waterEntries = todayWaterLogs.map(log => ({
      id: log.id,
      amount: log.amount,
      time: formatTimeChile(log.createdAt),
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
      streakDays,
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

