'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { At, Key, Eye, EyeClosed } from '@phosphor-icons/react';
import Link from 'next/link';
import { APP_VERSION } from '@/lib/constants';
import { CharlideasCredit } from '@/components/ui/CharlideasCredit';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Email o contraseña incorrectos';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          // Si la respuesta no es JSON, usar el status
          if (response.status === 405) {
            errorMessage = 'Error de método. Por favor, contacta al administrador.';
          } else if (response.status === 500) {
            errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
          }
        }
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'Ocurrió un error. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col overflow-hidden">
      {/* Header oscuro con logo */}
      <div className="bg-[#131917] rounded-b-[60px] py-[35px] px-[50px] flex flex-col items-center flex-shrink-0">
        {/* Logo: 3 puntos verticales con título */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <div className="w-3 h-3 rounded-full bg-[#3CCC1F]" />
            <div className="w-3 h-3 rounded-full bg-[#E5C438]" />
            <div className="w-3 h-3 rounded-full bg-[#DC3714]" />
          </div>
          <h1 className="text-white font-bold text-[36px] leading-tight">NutriTrack</h1>
        </div>
        
        {/* Tagline */}
        <p className="text-white text-center text-[14px] font-normal leading-relaxed max-w-[280px]">
          Registro diario de alimentos y seguimiento nutricional con análisis, estadísticas y recordatorios.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-[25px] pt-[40px] pb-[20px] flex flex-col min-h-0 overflow-y-auto">
        {/* Título */}
        <h2 className="text-[#131917] font-semibold text-[36px] text-center mb-5">
          Iniciar Sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Campo Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#131917] text-[14px] font-medium">
              Correo
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
                <At size={20} weight="regular" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@dominio.com"
                required
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#131917] text-[14px] font-medium">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
                <Key size={20} weight="regular" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-[50px] py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A] hover:text-[#131917] transition-colors"
              >
                {showPassword ? <Eye size={20} weight="regular" /> : <EyeClosed size={20} weight="regular" />}
              </button>
            </div>
          </div>

          {/* Link recuperar contraseña */}
          <div className="flex items-center justify-end gap-1 text-[12px] -mt-[19px]">
            <span className="text-[#5A5B5A]">No puedes iniciar sesión?</span>
            <Link href="/forgot-password" className="bg-[#3CCC1F] text-[#131917] px-3 py-1 rounded-[8px] font-semibold hover:opacity-90 transition-opacity">
              Recuperar contraseña
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[15px] text-[14px]">
              {error}
            </div>
          )}

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3CCC1F] text-[#131917] rounded-[15px] py-[10px] font-semibold text-[18px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-[30px]"
          >
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </button>

          {/* Link crear cuenta */}
          <div className="flex items-center justify-center gap-1 text-[12px] mt-[5px]">
            <span className="text-[#5A5B5A]">Aún no tienes cuenta?</span>
            <Link href="/register" className="bg-[#3CCC1F] text-[#131917] px-3 py-1 rounded-[8px] font-semibold hover:opacity-90 transition-opacity">
              Crear nueva cuenta
            </Link>
          </div>
        </form>

        {/* Footer versión y crédito */}
        <div className="text-center mt-auto pt-4 space-y-1 flex-shrink-0">
          <p className="text-[#5A5B5A] text-[12px]">v{APP_VERSION}</p>
          <CharlideasCredit />
        </div>
      </div>
    </div>
  );
}
