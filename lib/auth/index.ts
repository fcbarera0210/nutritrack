import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users, userProfiles, userStreaks } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createSession, deleteSession, getSession } from './session';
import { registerSchema } from '../validations/auth';

export async function login(email: string, password: string) {
  try {
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userList.length === 0) {
      return { error: 'Email o contraseña incorrectos' };
    }

    const user = userList[0];
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return { error: 'Email o contraseña incorrectos' };
    }

    await createSession(user.id.toString(), user.email, user.name || undefined);
    return { success: true, user };
  } catch (error: any) {
    // Capturar errores de BD específicos y re-lanzarlos para que el endpoint los maneje
    console.error('Login DB error:', error?.message);
    throw error;
  }
}

export async function register(name: string, email: string, password: string) {
  const validatedData = registerSchema.parse({ name, email, password });

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, validatedData.email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: 'Este email ya está registrado' };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(validatedData.password, 10);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email: validatedData.email,
      passwordHash,
      name: validatedData.name,
    })
    .returning();

  // Create user profile
  await db.insert(userProfiles).values({
    userId: newUser.id,
  });

  // Create user streaks
  await db.insert(userStreaks).values({
    userId: newUser.id,
  });

  await createSession(newUser.id.toString(), newUser.email, newUser.name || undefined);
  return { success: true, userId: newUser.id };
}

export async function logout() {
  await deleteSession();
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  
  // Handle both userId and user_id for backward compatibility
  const userId = session.userId ? parseInt(session.userId as string) : 
                  (session as any).user_id ? parseInt((session as any).user_id as string) : null;
  
  if (!userId) return null;
  
  const userList = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  if (userList.length === 0) return null;
  return userList[0];
}
