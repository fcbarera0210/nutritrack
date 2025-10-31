import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const result = await login(email, password);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Login exitoso', user: result.user },
      { status: 200 }
    );
  } catch (error: any) {
    // Mejor logging para debugging en producción
    const errorMessage = error?.message || 'Error desconocido';
    const isDbError = errorMessage.includes('DATABASE_URL') || 
                      errorMessage.includes('connection') ||
                      errorMessage.includes('relation') ||
                      errorMessage.includes('does not exist');
    
    console.error('Login error:', {
      message: errorMessage,
      isDbError,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });

    return NextResponse.json(
      { 
        error: isDbError 
          ? 'Error de conexión con la base de datos. Verifica que las migraciones estén aplicadas.' 
          : 'Error al iniciar sesión',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

