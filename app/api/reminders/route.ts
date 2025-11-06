import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { mealReminders } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const reminderSchema = z.object({
  id: z.number().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  enabled: z.boolean().optional(),
});

// GET: Obtener recordatorios del usuario
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const reminders = await db
      .select()
      .from(mealReminders)
      .where(eq(mealReminders.userId, user.id));

    return NextResponse.json(reminders);
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Error al obtener recordatorios', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Crear o actualizar recordatorio
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = reminderSchema.parse(body);

    // Verificar si existe un recordatorio para este tipo de comida
    const existing = await db
      .select()
      .from(mealReminders)
      .where(
        and(
          eq(mealReminders.userId, user.id),
          eq(mealReminders.mealType, validatedData.mealType)
        )
      )
      .limit(1);

    // Si existe un recordatorio para este tipo de comida, actualizarlo
    if (existing.length > 0) {
      await db
        .update(mealReminders)
        .set({
          hour: validatedData.hour,
          minute: validatedData.minute,
          enabled: validatedData.enabled ?? true,
          updatedAt: new Date(),
        })
        .where(eq(mealReminders.id, existing[0].id));

      return NextResponse.json({ success: true });
    }

    // Si tiene ID, actualizar (compatibilidad con código antiguo)
    if (validatedData.id) {
      await db
        .update(mealReminders)
        .set({
          hour: validatedData.hour,
          minute: validatedData.minute,
          enabled: validatedData.enabled ?? true,
          updatedAt: new Date(),
        })
        .where(eq(mealReminders.id, validatedData.id));

      return NextResponse.json({ success: true });
    }

    // Crear nuevo recordatorio
    await db.insert(mealReminders).values({
      userId: user.id,
      mealType: validatedData.mealType,
      hour: validatedData.hour,
      minute: validatedData.minute,
      enabled: validatedData.enabled ?? true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating/updating reminder:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al guardar recordatorio', details: error.message },
      { status: 500 }
    );
  }
}

