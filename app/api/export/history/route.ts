import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods, exercises } from '@/lib/db/schema';
import { eq, gte, lte, desc, and } from 'drizzle-orm';
import { formatDateLocal, formatTimeChile } from '@/lib/utils/date';

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

    // Fetch food logs with foods (including createdAt and servingSize)
    const logs = await db
      .select({
        id: foodLogs.id,
        date: foodLogs.date,
        mealType: foodLogs.mealType,
        quantity: foodLogs.quantity,
        servingSize: foodLogs.servingSize,
        createdAt: foodLogs.createdAt,
        food: foods,
      })
      .from(foodLogs)
      .innerJoin(foods, eq(foodLogs.foodId, foods.id))
      .where(
        and(
          eq(foodLogs.userId, user.id),
          gte(foodLogs.date, formatDateLocal(startDate)),
          lte(foodLogs.date, formatDateLocal(today))
        )
      )
      .orderBy(desc(foodLogs.date));

    // Fetch exercises (including createdAt)
    const exercisesData = await db
      .select()
      .from(exercises)
      .where(
        and(
          eq(exercises.userId, user.id),
          gte(exercises.date, formatDateLocal(startDate)),
          lte(exercises.date, formatDateLocal(today))
        )
      )
      .orderBy(desc(exercises.date));

    // Función para escapar valores CSV (maneja comas y comillas)
    const escapeCsvValue = (value: string | number): string => {
      const str = String(value);
      // Si contiene comas, comillas o saltos de línea, envolver en comillas y escapar comillas internas
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Generar CSV con BOM UTF-8 para caracteres especiales (tildes, ñ, etc.)
    // BOM UTF-8: 0xEF, 0xBB, 0xBF
    let csv = '\uFEFF'; // BOM UTF-8
    csv += 'Fecha,Hora,Tipo,Item,Cantidad,Calorias,Proteina (g),Carbohidratos (g),Grasas (g)\n';

    // Add food logs
    logs.forEach((log) => {
      // Usar createdAt para la hora y date para la fecha
      // log.date viene en formato YYYY-MM-DD, convertir a DD/MM/YYYY
      const [year, month, day] = log.date.split('-');
      const dateStr = `${day}/${month}/${year}`;
      const timeStr = formatTimeChile(log.createdAt);
      
      // Calcular cantidad real: quantity es el multiplicador, servingSize es el tamaño de porción
      const actualQuantity = log.quantity * log.servingSize;
      const servingUnit = log.food.servingUnit || 'g';
      
      // Calcular valores nutricionales
      const multiplier = log.quantity; // quantity ya es el multiplicador del servingSize
      const calories = Math.round(log.food.calories * multiplier);
      const protein = (log.food.protein * multiplier).toFixed(1);
      const carbs = (log.food.carbs * multiplier).toFixed(1);
      const fat = (log.food.fat * multiplier).toFixed(1);

      // Escapar valores que puedan contener comas o comillas
      const foodName = escapeCsvValue(log.food.name);
      const quantityStr = `${actualQuantity.toFixed(1)}${servingUnit}`;

      csv += `${dateStr},${timeStr},Comida,${foodName},${quantityStr},${calories},${protein},${carbs},${fat}\n`;
    });

    // Add exercises
    exercisesData.forEach((ex) => {
      // ex.date viene en formato YYYY-MM-DD, convertir a DD/MM/YYYY
      const [year, month, day] = ex.date.split('-');
      const dateStr = `${day}/${month}/${year}`;
      const timeStr = formatTimeChile(ex.createdAt);

      // Escapar nombre del ejercicio
      const exerciseName = escapeCsvValue(ex.name);

      csv += `${dateStr},${timeStr},Ejercicio,${exerciseName},${ex.durationMinutes} min,-${ex.caloriesBurned},0,0,0\n`;
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
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

