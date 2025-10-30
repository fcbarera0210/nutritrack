import { NextResponse, NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { mealReminders } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// PUT: Actualizar recordatorio específico
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await context.params;
    const reminderId = parseInt(id);
    const body = await req.json();

    await db
      .update(mealReminders)
      .set({
        hour: body.hour,
        minute: body.minute,
        enabled: body.enabled,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(mealReminders.id, reminderId),
          eq(mealReminders.userId, user.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Error al actualizar recordatorio', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar recordatorio
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await context.params;
    const reminderId = parseInt(id);

    await db
      .delete(mealReminders)
      .where(
        and(
          eq(mealReminders.id, reminderId),
          eq(mealReminders.userId, user.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: 'Error al eliminar recordatorio', details: error.message },
      { status: 500 }
    );
  }
}

