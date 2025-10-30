import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST() {
  try {
    await logout();
    return NextResponse.json(
      { message: 'Logout exitoso' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al cerrar sesión', details: error.message },
      { status: 500 }
    );
  }
}

