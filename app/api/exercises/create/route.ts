import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { exercises } from '@/lib/db/schema';
import { exerciseSchema } from '@/lib/validations/food';
import { updateUserStreak } from '@/lib/utils/streaks';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = exerciseSchema.parse(body);

    // Create exercise log
    const [log] = await db
      .insert(exercises)
      .values({
        userId: user.id,
        name: validatedData.name,
        durationMinutes: validatedData.durationMinutes,
        caloriesBurned: validatedData.caloriesBurned,
        icon: validatedData.icon || 'Barbell',
        date: validatedData.date,
      })
      .returning();

    // Update user streak
    await updateUserStreak(user.id, validatedData.date);

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exercise log:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar ejercicio', details: error.message },
      { status: 500 }
    );
  }
}

