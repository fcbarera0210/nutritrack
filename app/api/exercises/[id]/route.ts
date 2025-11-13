import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { exercises } from '@/lib/db/schema';
import { exerciseSchema } from '@/lib/validations/food';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const exerciseId = parseInt(id);

    if (isNaN(exerciseId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el ejercicio existe y pertenece al usuario
    const [existingExercise] = await db
      .select()
      .from(exercises)
      .where(
        and(
          eq(exercises.id, exerciseId),
          eq(exercises.userId, user.id)
        )
      )
      .limit(1);

    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Ejercicio no encontrado o no tienes permiso para editarlo' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = exerciseSchema.parse(body);

    // Actualizar ejercicio
    const [updatedExercise] = await db
      .update(exercises)
      .set({
        name: validatedData.name,
        durationMinutes: validatedData.durationMinutes,
        caloriesBurned: validatedData.caloriesBurned,
        icon: validatedData.icon || 'Barbell',
        date: validatedData.date,
      })
      .where(eq(exercises.id, exerciseId))
      .returning();

    return NextResponse.json({ success: true, exercise: updatedExercise });
  } catch (error: any) {
    console.error('Error updating exercise:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar ejercicio', details: error.message },
      { status: 500 }
    );
  }
}

