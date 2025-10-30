import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { profileSchema } from '@/lib/validations/auth';
import { calculateTDEE, calculateMacros } from '@/lib/utils/calories';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json(profile[0]);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Error al obtener perfil', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileSchema.parse(body);

    // Calculate TDEE and macros if we have the required data
    let targetCalories = validatedData.targetCalories;
    let targetProtein = validatedData.targetProtein;
    let targetCarbs = validatedData.targetCarbs;
    let targetFat = validatedData.targetFat;

    if (validatedData.weight && validatedData.height && validatedData.age && validatedData.gender && validatedData.activityLevel) {
      const tdee = calculateTDEE(
        validatedData.weight,
        validatedData.height,
        validatedData.age,
        validatedData.gender as 'male' | 'female',
        validatedData.activityLevel
      );
      
      const goal = validatedData.goal || 'maintenance';
      const macros = calculateMacros(tdee, goal as 'weight_loss' | 'maintenance' | 'muscle_gain');
      
      targetCalories = macros.calories;
      targetProtein = macros.protein;
      targetCarbs = macros.carbs;
      targetFat = macros.fat;
    }

    await db
      .update(userProfiles)
      .set({
        ...validatedData,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar perfil', details: error.message },
      { status: 500 }
    );
  }
}

