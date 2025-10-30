import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const logId = parseInt(searchParams.get('id') || '0');

    if (!logId) {
      return NextResponse.json({ error: 'ID de log requerido' }, { status: 400 });
    }

    // Verify ownership
    const existingLog = await db
      .select()
      .from(foodLogs)
      .where(and(
        eq(foodLogs.id, logId),
        eq(foodLogs.userId, user.id)
      ))
      .limit(1);

    if (existingLog.length === 0) {
      return NextResponse.json({ error: 'Log no encontrado' }, { status: 404 });
    }

    // Delete log
    await db
      .delete(foodLogs)
      .where(eq(foodLogs.id, logId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting log:', error);
    return NextResponse.json(
      { error: 'Error al eliminar log', details: error.message },
      { status: 500 }
    );
  }
}

