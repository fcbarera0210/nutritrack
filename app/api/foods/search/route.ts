import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foods } from '@/lib/db/schema';
import { or, ilike, eq, and, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

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
    const customOnly = searchParams.get('customOnly') === 'true';

    // Obtener usuario actual si está autenticado (para filtrar personalizados)
    const user = await getCurrentUser();

    // Si no hay query, devolver todos los alimentos
    if (!query || query.trim().length === 0) {
      let allResults;
      
      if (customOnly && user) {
        // Filtrar solo alimentos personalizados del usuario
        allResults = await db
          .select()
          .from(foods)
          .where(
            and(
              eq(foods.isCustom, true),
              eq(foods.userId, user.id)
            )
          )
          .limit(limit);
      } else {
        // Excluir alimentos personalizados de otros usuarios
        // Solo mostrar: alimentos no personalizados (isCustom = false o null) O alimentos personalizados del usuario actual
        if (user) {
          allResults = await db
            .select()
            .from(foods)
            .where(
              or(
                eq(foods.isCustom, false),
                isNull(foods.isCustom),
                and(
                  eq(foods.isCustom, true),
                  eq(foods.userId, user.id)
                )
              )
            )
            .limit(limit);
        } else {
          // Si no hay usuario autenticado, solo mostrar alimentos no personalizados
          allResults = await db
            .select()
            .from(foods)
            .where(
              or(
                eq(foods.isCustom, false),
                isNull(foods.isCustom)
              )
            )
            .limit(limit);
        }
      }
      
      return NextResponse.json(allResults);
    }

    // Búsqueda case-insensitive que contiene el término
    // Usar ILIKE para búsqueda case-insensitive
    let results;
    
    if (customOnly && user) {
      // Filtrar solo alimentos personalizados del usuario que coincidan con la búsqueda
      results = await db
        .select()
        .from(foods)
        .where(
          and(
            eq(foods.isCustom, true),
            eq(foods.userId, user.id),
            or(
              ilike(foods.name, `%${query}%`),
              ilike(foods.brand, `%${query}%`)
            )
          )
        )
        .limit(limit);
    } else {
      // Excluir alimentos personalizados de otros usuarios
      // Solo mostrar: alimentos no personalizados (isCustom = false o null) O alimentos personalizados del usuario actual
      if (user) {
        results = await db
          .select()
          .from(foods)
          .where(
            and(
              or(
                ilike(foods.name, `%${query}%`),
                ilike(foods.brand, `%${query}%`)
              ),
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
          .limit(limit);
      } else {
        // Si no hay usuario autenticado, solo mostrar alimentos no personalizados
        results = await db
          .select()
          .from(foods)
          .where(
            and(
              or(
                ilike(foods.name, `%${query}%`),
                ilike(foods.brand, `%${query}%`)
              ),
              or(
                eq(foods.isCustom, false),
                isNull(foods.isCustom)
              )
            )
          )
          .limit(limit);
      }
    }

    // También buscar con texto normalizado para que coincida sin tildes
    const normalizedQuery = normalizeText(query);
    
    // Si no hay resultados con búsqueda simple, buscar con texto normalizado
    if (results.length === 0) {
      let normalizedResults;
      
      if (customOnly && user) {
        normalizedResults = await db
          .select()
          .from(foods)
          .where(
            and(
              eq(foods.isCustom, true),
              eq(foods.userId, user.id)
            )
          )
          .limit(limit);
      } else {
        // Excluir alimentos personalizados de otros usuarios
        if (user) {
          normalizedResults = await db
            .select()
            .from(foods)
            .where(
              or(
                eq(foods.isCustom, false),
                isNull(foods.isCustom),
                and(
                  eq(foods.isCustom, true),
                  eq(foods.userId, user.id)
                )
              )
            )
            .limit(limit);
        } else {
          // Si no hay usuario autenticado, solo mostrar alimentos no personalizados
          normalizedResults = await db
            .select()
            .from(foods)
            .where(
              or(
                eq(foods.isCustom, false),
                isNull(foods.isCustom)
              )
            )
            .limit(limit);
        }
      }
      
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

