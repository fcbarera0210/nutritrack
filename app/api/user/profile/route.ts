import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfiles, users } from '@/lib/db/schema';
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

    const profileData = profile[0];
    
    // Obtener datos del usuario (nombre y email)
    const userData = await db
      .select({
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    
    const userInfo = userData.length > 0 ? userData[0] : { name: null, email: null };
    
    // Debug: Log para ver qué datos devuelve Drizzle
    console.log('Datos de Drizzle (raw):', JSON.stringify(profileData, null, 2));
    
    // Transformar datos de snake_case a camelCase para el frontend
    const transformedProfile = {
      name: userInfo.name ?? null,
      email: userInfo.email ?? null,
      weight: profileData.weight ?? null,
      height: profileData.height ?? null,
      age: profileData.age ?? null,
      gender: profileData.gender ?? null,
      activityLevel: profileData.activityLevel ?? null,
      goal: profileData.goal ?? null,
      targetCalories: profileData.targetCalories ?? null,
      targetProtein: profileData.targetProtein ?? null,
      targetCarbs: profileData.targetCarbs ?? null,
      targetFat: profileData.targetFat ?? null,
      manualTargets: profileData.manualTargets ?? false,
      targetWeight: profileData.targetWeight ?? null,
      preferredSports: profileData.preferredSports ? (() => {
        try {
          return typeof profileData.preferredSports === 'string' 
            ? JSON.parse(profileData.preferredSports) 
            : profileData.preferredSports;
        } catch {
          return [];
        }
      })() : [],
      dietaryPreferences: profileData.dietaryPreferences ? (() => {
        try {
          return typeof profileData.dietaryPreferences === 'string'
            ? JSON.parse(profileData.dietaryPreferences)
            : profileData.dietaryPreferences;
        } catch {
          return [];
        }
      })() : [],
      foodAllergies: profileData.foodAllergies ?? null,
      bio: profileData.bio ?? null,
      phone: profileData.phone ?? null,
    };
    
    console.log('Datos transformados:', JSON.stringify(transformedProfile, null, 2));

    return NextResponse.json(transformedProfile);
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

    // Actualizar nombre en la tabla users si viene en el body
    if (validatedData.name !== undefined) {
      await db
        .update(users)
        .set({ name: validatedData.name })
        .where(eq(users.id, user.id));
    }

    // Calculate TDEE and macros if we have the required data AND manualTargets is false
    let targetCalories = validatedData.targetCalories;
    let targetProtein = validatedData.targetProtein;
    let targetCarbs = validatedData.targetCarbs;
    let targetFat = validatedData.targetFat;

    // Solo calcular automáticamente si manualTargets es false o no está definido
    if (!validatedData.manualTargets && validatedData.weight && validatedData.height && validatedData.age && validatedData.gender && validatedData.activityLevel) {
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

    // Preparar datos para actualizar (convertir arrays a JSON strings)
    const updateData: any = {
      ...validatedData,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      updatedAt: new Date(),
    };

    // Remover 'name' del updateData porque ya se actualizó en users
    delete updateData.name;

    // Convertir arrays a JSON strings para guardar en la base de datos
    if (validatedData.preferredSports !== undefined) {
      updateData.preferredSports = validatedData.preferredSports ? JSON.stringify(validatedData.preferredSports) : null;
    }
    if (validatedData.dietaryPreferences !== undefined) {
      updateData.dietaryPreferences = validatedData.dietaryPreferences ? JSON.stringify(validatedData.dietaryPreferences) : null;
    }

    await db
      .update(userProfiles)
      .set(updateData)
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

