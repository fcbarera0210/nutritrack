import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const dynamicParams = true;

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Cuerpo de la solicitud inválido' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Por seguridad, siempre retornamos éxito aunque el usuario no exista
    // para evitar enumeración de usuarios
    if (userList.length === 0) {
      // Usuario no existe, pero retornamos éxito igual
      return NextResponse.json(
        { message: 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.' },
        { status: 200 }
      );
    }

    // TODO: Aquí deberías implementar:
    // 1. Generar token de recuperación
    // 2. Guardar token en BD con expiración
    // 3. Enviar email con enlace de recuperación
    // Por ahora solo retornamos éxito

    return NextResponse.json(
      { message: 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

