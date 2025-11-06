import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foods } from '@/lib/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const foodId = parseInt(id);

    if (isNaN(foodId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Obtener usuario actual para verificar permisos en alimentos personalizados
    const user = await getCurrentUser();

    // Consultar alimento con filtro de seguridad
    let food;
    
    if (user) {
      // Si hay usuario autenticado, permitir:
      // - Alimentos no personalizados (isCustom = false o null)
      // - Alimentos personalizados del usuario actual
      food = await db
        .select()
        .from(foods)
        .where(
          and(
            eq(foods.id, foodId),
            or(
              eq(foods.isCustom, false),
              isNull(foods.isCustom),
              and(
                eq(foods.isCustom, true),
                eq(foods.userId, user.id)
              )
            )
          )
        )
        .limit(1);
    } else {
      // Si no hay usuario autenticado, solo mostrar alimentos no personalizados
      food = await db
        .select()
        .from(foods)
        .where(
          and(
            eq(foods.id, foodId),
            or(
              eq(foods.isCustom, false),
              isNull(foods.isCustom)
            )
          )
        )
        .limit(1);
    }

    if (food.length === 0) {
      return NextResponse.json({ error: 'Alimento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(food[0]);
  } catch (error: any) {
    console.error('Error fetching food:', error);
    return NextResponse.json(
      { error: 'Error al obtener alimento', details: error.message },
      { status: 500 }
    );
  }
}

