/**
 * Utilidades para manejo de rachas (streaks) de usuarios
 */

import { db } from '../db';
import { userStreaks } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getTodayDateLocal, formatDateLocal } from './date';

/**
 * Actualiza la racha del usuario cuando registra una comida o ejercicio
 * Un día cuenta como marcado si tiene al menos 1 comida o 1 ejercicio
 */
export async function updateUserStreak(userId: number, date: string) {
  try {
    const streakData = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (streakData.length === 0) {
      // Crear registro de racha si no existe
      await db.insert(userStreaks).values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastLoggedDate: date,
        totalLogs: 1,
      });
      return;
    }

    const streak = streakData[0];
    const today = getTodayDateLocal();
    
    // Calcular fecha de ayer
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = formatDateLocal(yesterdayDate);

    let newCurrentStreak = streak.currentStreak;
    let newLongestStreak = streak.longestStreak;

    if (date === today) {
      // Si es el día de hoy
      if (!streak.lastLoggedDate) {
        // Primera vez que registra algo
        newCurrentStreak = 1;
      } else if (streak.lastLoggedDate === today) {
        // Ya registró algo hoy, mantener la racha actual (no incrementar)
        newCurrentStreak = streak.currentStreak;
      } else if (streak.lastLoggedDate === yesterdayStr) {
        // Registró ayer, continuar la racha incrementando
        newCurrentStreak = streak.currentStreak + 1;
      } else {
        // Racha rota (no registró ayer), empezar de nuevo
        newCurrentStreak = 1;
      }

      // Actualizar la racha más larga si es necesario
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
    // Si la fecha es pasada o futura, no actualizamos la racha actual
    // pero el calendario mostrará esos días con el ícono de llama
  } catch (error) {
    console.error('Error updating user streak:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
}

