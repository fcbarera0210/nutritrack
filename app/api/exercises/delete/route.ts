import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { exercises } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const exerciseId = parseInt(searchParams.get('id') || '0');

    if (!exerciseId) {
      return NextResponse.json({ error: 'ID de ejercicio requerido' }, { status: 400 });
    }

    // Verify ownership and delete
    await db
      .delete(exercises)
      .where(and(
        eq(exercises.id, exerciseId),
        eq(exercises.userId, user.id)
      ));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Error al eliminar ejercicio', details: error.message },
      { status: 500 }
    );
  }
}

