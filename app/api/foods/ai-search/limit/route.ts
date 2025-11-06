import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { aiSearchLogs } from '@/lib/db/schema';
import { getTodayDateLocal } from '@/lib/utils/date';
import { eq, and, count } from 'drizzle-orm';

// Límite diario de búsquedas por usuario
const DAILY_SEARCH_LIMIT = 15;

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener búsquedas de hoy
    const today = getTodayDateLocal();
    
    // SIMULACIÓN: Descomentar la siguiente línea para simular que el límite está alcanzado
    // const SIMULATE_LIMIT_REACHED = true;
    const SIMULATE_LIMIT_REACHED = false; // Cambiar a true para simular límite alcanzado
    
    const todaySearches = await db
      .select({ count: count() })
      .from(aiSearchLogs)
      .where(
        and(
          eq(aiSearchLogs.userId, user.id),
          eq(aiSearchLogs.date, today)
        )
      );

    const searchCount = todaySearches[0]?.count || 0;
    const effectiveSearchCount = SIMULATE_LIMIT_REACHED ? DAILY_SEARCH_LIMIT : searchCount;
    const searchesRemaining = Math.max(0, DAILY_SEARCH_LIMIT - effectiveSearchCount);

    return NextResponse.json({ 
      dailyLimit: DAILY_SEARCH_LIMIT,
      searchesUsed: effectiveSearchCount,
      searchesRemaining: searchesRemaining,
    });
  } catch (error: any) {
    console.error('Error obteniendo límite de búsquedas:', error);
    return NextResponse.json(
      { error: 'Error al obtener límite de búsquedas', details: error.message },
      { status: 500 }
    );
  }
}

