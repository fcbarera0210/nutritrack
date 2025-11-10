import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { waterLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const waterLogId = parseInt(searchParams.get('id') || '0');

    if (!waterLogId) {
      return NextResponse.json({ error: 'ID de entrada de agua requerido' }, { status: 400 });
    }

    // Verify ownership and delete
    await db
      .delete(waterLogs)
      .where(and(
        eq(waterLogs.id, waterLogId),
        eq(waterLogs.userId, user.id)
      ));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting water log:', error);
    return NextResponse.json(
      { error: 'Error al eliminar entrada de agua', details: error.message },
      { status: 500 }
    );
  }
}

