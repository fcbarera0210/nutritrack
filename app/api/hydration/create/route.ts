import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { waterLogs } from '@/lib/db/schema';
import { z } from 'zod';
import { getTodayDateLocal } from '@/lib/utils/date';

const hydrationSchema = z.object({
  amount: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = hydrationSchema.parse(body);

    const date = validatedData.date || getTodayDateLocal();

    // Create water log
    const [log] = await db
      .insert(waterLogs)
      .values({
        userId: user.id,
        amount: validatedData.amount,
        date,
      })
      .returning();

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating water log:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar hidratación', details: error.message },
      { status: 500 }
    );
  }
}

