import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exerciseTypes } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const allExercises = await db
      .select()
      .from(exerciseTypes)
      .orderBy(asc(exerciseTypes.name));
    
    return NextResponse.json(allExercises);
  } catch (error: any) {
    console.error('Error fetching exercise types:', error);
    return NextResponse.json(
      { error: 'Error al obtener tipos de ejercicios', details: error.message },
      { status: 500 }
    );
  }
}

