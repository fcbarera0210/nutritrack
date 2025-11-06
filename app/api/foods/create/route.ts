import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foods } from '@/lib/db/schema';
import { foodSchema } from '@/lib/validations/food';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    
    // Normalizar brand: convertir string vacío a null
    if (body.brand === '') {
      body.brand = null;
    }
    
    const validatedData = foodSchema.parse(body);

    // Crear alimento personalizado
    const [food] = await db
      .insert(foods)
      .values({
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
        source: 'custom',
        isCustom: true,
        userId: user.id,
      })
      .returning();

    return NextResponse.json({ success: true, food }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating custom food:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear alimento personalizado', details: error.message },
      { status: 500 }
    );
  }
}

