import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { foodLogs, userStreaks } from '@/lib/db/schema';
import { eq, gte } from 'drizzle-orm';
import { foodLogSchema } from '@/lib/validations/food';
import { format } from 'date-fns';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = foodLogSchema.parse(body);

    const date = validatedData.date || format(new Date(), 'yyyy-MM-dd');

    // Create food log
    const [log] = await db
      .insert(foodLogs)
      .values({
        userId: user.id,
        foodId: validatedData.foodId,
        quantity: validatedData.quantity,
        servingSize: validatedData.servingSize,
        date,
        mealType: validatedData.mealType,
      })
      .returning();

    // Update user streak
    await updateUserStreak(user.id, date);

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating food log:', error);
    
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar alimento', details: error.message },
      { status: 500 }
    );
  }
}

async function updateUserStreak(userId: number, date: string) {
  const streakData = await db
    .select()
    .from(userStreaks)
    .where(eq(userStreaks.userId, userId))
    .limit(1);

  const streak = streakData[0];
  if (!streak) return;

  const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  let newCurrentStreak = streak.currentStreak;
  let newLongestStreak = streak.longestStreak;

  if (date === today) {
    // Same day logging - increment streak
    if (streak.lastLoggedDate === yesterday || streak.lastLoggedDate === today) {
      newCurrentStreak = streak.currentStreak;
    } else if (streak.lastLoggedDate === date) {
      newCurrentStreak = streak.currentStreak; // Same day
    } else {
      // Streak broken - reset
      newCurrentStreak = 1;
    }

    // Update longest streak if needed
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    await db
      .update(userStreaks)
      .set({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastLoggedDate: date,
        totalLogs: streak.totalLogs + 1,
      })
      .where(eq(userStreaks.userId, userId));
  }
}

