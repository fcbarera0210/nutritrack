import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foods } from '@/lib/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { foodSchema } from '@/lib/validations/food';

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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const foodId = parseInt(id);

    if (isNaN(foodId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el alimento existe y es personalizado del usuario
    const [existingFood] = await db
      .select()
      .from(foods)
      .where(
        and(
          eq(foods.id, foodId),
          eq(foods.isCustom, true),
          eq(foods.userId, user.id)
        )
      )
      .limit(1);

    if (!existingFood) {
      return NextResponse.json(
        { error: 'Alimento no encontrado o no tienes permiso para editarlo' },
        { status: 404 }
      );
    }

    const body = await req.json();
    
    // Normalizar brand: convertir string vacío a null
    if (body.brand === '') {
      body.brand = null;
    }
    
    const validatedData = foodSchema.parse(body);

    // Actualizar alimento personalizado
    const [updatedFood] = await db
      .update(foods)
      .set({
        name: validatedData.name,
        brand: validatedData.brand || null,
        calories: validatedData.calories,
        protein: validatedData.protein,
        carbs: validatedData.carbs,
        fat: validatedData.fat,
        fiber: validatedData.fiber || null,
        sodium: validatedData.sodium || null,
        sugar: validatedData.sugar || null,
        servingSize: validatedData.servingSize,
        servingUnit: validatedData.servingUnit,
        barcode: validatedData.barcode || null,
      })
      .where(eq(foods.id, foodId))
      .returning();

    return NextResponse.json({ success: true, food: updatedFood });
  } catch (error: any) {
    console.error('Error updating food:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar alimento personalizado', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const foodId = parseInt(id);

    if (isNaN(foodId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el alimento existe y es personalizado del usuario
    const [existingFood] = await db
      .select()
      .from(foods)
      .where(
        and(
          eq(foods.id, foodId),
          eq(foods.isCustom, true),
          eq(foods.userId, user.id)
        )
      )
      .limit(1);

    if (!existingFood) {
      return NextResponse.json(
        { error: 'Alimento no encontrado o no tienes permiso para eliminarlo' },
        { status: 404 }
      );
    }

    // Eliminar alimento personalizado (cascade eliminará los logs asociados)
    await db
      .delete(foods)
      .where(eq(foods.id, foodId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting food:', error);
    return NextResponse.json(
      { error: 'Error al eliminar alimento personalizado', details: error.message },
      { status: 500 }
    );
  }
}

