import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateLogSchema = z.object({
  id: z.number(),
  quantity: z.number().min(0.1).optional(),
  servingSize: z.number().min(1).optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido').optional(),
});

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateLogSchema.parse(body);

    // Verify ownership
    const existingLog = await db
      .select()
      .from(foodLogs)
      .where(and(
        eq(foodLogs.id, validatedData.id),
        eq(foodLogs.userId, user.id)
      ))
      .limit(1);

    if (existingLog.length === 0) {
      return NextResponse.json({ error: 'Log no encontrado' }, { status: 404 });
    }

    // Update log
    const updates: any = {};
    if (validatedData.quantity !== undefined) {
      updates.quantity = validatedData.quantity;
    }
    if (validatedData.servingSize !== undefined) {
      updates.servingSize = validatedData.servingSize;
    }
    if (validatedData.mealType !== undefined) {
      updates.mealType = validatedData.mealType;
    }
    if (validatedData.date !== undefined) {
      updates.date = validatedData.date;
    }

    await db
      .update(foodLogs)
      .set(updates)
      .where(eq(foodLogs.id, validatedData.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating log:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar log', details: error.message },
      { status: 500 }
    );
  }
}

