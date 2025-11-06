import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, foods } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { foodLogSchema } from '@/lib/validations/food';
import { getTodayDateLocal } from '@/lib/utils/date';
import { updateUserStreak } from '@/lib/utils/streaks';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = foodLogSchema.parse(body);

    const date = validatedData.date || getTodayDateLocal();

    // Verificar que el alimento existe y que el usuario tiene permiso para usarlo
    // (si es personalizado, debe ser del usuario actual)
    const food = await db
      .select()
      .from(foods)
      .where(eq(foods.id, validatedData.foodId))
      .limit(1);

    if (food.length === 0) {
      return NextResponse.json({ error: 'Alimento no encontrado' }, { status: 404 });
    }

    const foodData = food[0];
    
    // Si el alimento es personalizado, verificar que pertenece al usuario actual
    if (foodData.isCustom && foodData.userId !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para usar este alimento personalizado' },
        { status: 403 }
      );
    }

    // Create food log
    const [log] = await db
      .insert(foodLogs)
      .values({
        userId: user.id,
        foodId: validatedData.foodId,
        quantity: validatedData.quantity,
        servingSize: validatedData.servingSize,
        date,
        mealType: validatedData.mealType,
      })
      .returning();

    // Update user streak
    await updateUserStreak(user.id, date);

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating food log:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar alimento', details: error.message },
      { status: 500 }
    );
  }
}

