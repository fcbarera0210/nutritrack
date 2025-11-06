import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foods } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET: Verificar si el usuario tiene alimentos personalizados
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Contar alimentos personalizados del usuario
    const customFoods = await db
      .select()
      .from(foods)
      .where(
        and(
          eq(foods.isCustom, true),
          eq(foods.userId, user.id)
        )
      )
      .limit(1);

    const hasCustomFoods = customFoods.length > 0;

    return NextResponse.json({ hasCustomFoods });
  } catch (error: any) {
    console.error('Error checking custom foods:', error);
    return NextResponse.json(
      { error: 'Error al verificar alimentos personalizados', details: error.message },
      { status: 500 }
    );
  }
}

