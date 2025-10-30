import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises } from '@/lib/db/schema';
import { eq, gte, lte, desc, and } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

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
          gte(foodLogs.date, startDate.toISOString()),
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
          gte(exercises.date, startDate.toISOString()),
          lte(exercises.date, today.toISOString())
        )
      )
      .orderBy(desc(exercises.date));

    // Generate CSV
    let csv = 'Fecha,Hora,Tipo,Item,Cantidad,Calorias,Proteina (g),Carbohidratos (g),Grasas (g),Fibra (g)\n';

    // Add food logs
    logs.forEach((log) => {
      const date = new Date(log.date);
      const dateStr = date.toLocaleDateString('es-CL');
      const timeStr = date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
      
      const multiplier = log.quantity / 100;
      const calories = Math.round(log.food.calories * multiplier);
      const protein = (log.food.protein * multiplier).toFixed(1);
      const carbs = (log.food.carbs * multiplier).toFixed(1);
      const fat = (log.food.fat * multiplier).toFixed(1);
      const fiber = (((log.food as any).fiber ?? 0) * multiplier).toFixed(1);

      csv += `${dateStr},${timeStr},Comida,${log.food.name},${log.quantity}g,${calories},${protein},${carbs},${fat},${fiber}\n`;
    });

    // Add exercises
    exercisesData.forEach((ex) => {
      const date = new Date(ex.date);
      const dateStr = date.toLocaleDateString('es-CL');
      const timeStr = date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

      csv += `${dateStr},${timeStr},Ejercicio,${ex.name},${ex.durationMinutes} min,-${ex.caloriesBurned},0,0,0,0\n`;
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="nutritrack-historial-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting history:', error);
    return NextResponse.json(
      { error: 'Error al exportar historial', details: error.message },
      { status: 500 }
    );
  }
}

