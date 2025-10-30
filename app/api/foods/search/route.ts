import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foods } from '@/lib/db/schema';
import { ilike, or } from 'drizzle-orm';

// Función para normalizar texto (eliminar tildes y convertir a minúsculas)
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Si no hay query, devolver todos los alimentos
    if (!query || query.trim().length === 0) {
      const allResults = await db
        .select()
        .from(foods)
        .limit(limit);
      return NextResponse.json(allResults);
    }

    // Búsqueda case-insensitive que contiene el término
    // Usar ILIKE para búsqueda case-insensitive
    const results = await db
      .select()
      .from(foods)
      .where(
        or(
          ilike(foods.name, `%${query}%`),
          ilike(foods.brand, `%${query}%`)
        )
      )
      .limit(limit);

    // También buscar con texto normalizado para que coincida sin tildes
    const normalizedQuery = normalizeText(query);
    
    // Si no hay resultados con búsqueda simple, buscar con texto normalizado
    if (results.length === 0) {
      const normalizedResults = await db
        .select()
        .from(foods)
        .limit(limit);
      
      // Filtrar en memoria usando texto normalizado
      const filteredResults = normalizedResults.filter(food => {
        const normalizedName = normalizeText(food.name || '');
        const normalizedBrand = normalizeText(food.brand || '');
        return normalizedName.includes(normalizedQuery) || normalizedBrand.includes(normalizedQuery);
      });
      
      return NextResponse.json(filteredResults);
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error searching foods:', error);
    return NextResponse.json(
      { error: 'Error al buscar alimentos' },
      { status: 500 }
    );
  }
}

