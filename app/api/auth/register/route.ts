import { NextResponse } from 'next/server';
import { register } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await register(body.name, body.email, body.password);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', userId: result.userId },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear usuario', details: error.message },
      { status: 500 }
    );
  }
}
