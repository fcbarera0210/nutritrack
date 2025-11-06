import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { userFavorites, foods } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET: Obtener favoritos del usuario
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const favorites = await db
      .select({
        foodId: userFavorites.foodId,
      })
      .from(userFavorites)
      .where(eq(userFavorites.userId, user.id));

    const favoriteIds = favorites.map(f => f.foodId);

    return NextResponse.json({ favoriteIds });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Error al obtener favoritos', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Agregar a favoritos
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { foodId } = body;

    if (!foodId) {
      return NextResponse.json({ error: 'foodId es requerido' }, { status: 400 });
    }

    // Verificar si ya existe
    const existing = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, user.id),
          eq(userFavorites.foodId, foodId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Ya está en favoritos' });
    }

    // Agregar a favoritos
    await db.insert(userFavorites).values({
      userId: user.id,
      foodId: foodId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Error al agregar a favoritos', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar de favoritos
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const foodId = searchParams.get('foodId');

    if (!foodId) {
      return NextResponse.json({ error: 'foodId es requerido' }, { status: 400 });
    }

    await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, user.id),
          eq(userFavorites.foodId, parseInt(foodId))
        )
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Error al eliminar de favoritos', details: error.message },
      { status: 500 }
    );
  }
}

