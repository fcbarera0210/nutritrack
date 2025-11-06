import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    await logout();
    
    // Asegurar que la cookie se elimine correctamente
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    // Retornar respuesta con headers para limpiar cookies en el cliente
    const response = NextResponse.json(
      { message: 'Logout exitoso' },
      { status: 200 }
    );
    
    // Limpiar cookie en la respuesta también
    response.cookies.delete('session');
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al cerrar sesión', details: error.message },
      { status: 500 }
    );
  }
}

