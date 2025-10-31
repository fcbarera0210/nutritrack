'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { At, Key, Eye, EyeClosed, User } from '@phosphor-icons/react';
import Link from 'next/link';
import { APP_VERSION } from '@/lib/constants';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Error al registrar';
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
      router.push('/login?registered=true');
    } catch (error: any) {
      console.error('Register error:', error);
      setError(error?.message || 'Ocurrió un error. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
      {/* Header oscuro con logo */}
      <div className="bg-[#131917] rounded-b-[60px] py-[35px] px-[50px] flex flex-col items-center">
        {/* Logo: 3 puntos verticales con título */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <div className="w-3 h-3 rounded-full bg-[#CEFB48]" />
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
      <div className="flex-1 px-[25px] pt-[40px] pb-[20px] flex flex-col">
        {/* Título */}
        <h2 className="text-[#131917] font-semibold text-[36px] text-center mb-5">
          Crear Cuenta
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Campo Nombre */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#131917] text-[14px] font-medium">
              Nombre
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
                <User size={20} weight="regular" />
              </div>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Pérez"
                required
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none transition-all"
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@dominio.com"
                required
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none transition-all"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-[50px] py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none transition-all"
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

          {/* Campo Confirmar Contraseña */}
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-[#131917] text-[14px] font-medium">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
                <Key size={20} weight="regular" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-[50px] py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A] hover:text-[#131917] transition-colors"
              >
                {showConfirmPassword ? <Eye size={20} weight="regular" /> : <EyeClosed size={20} weight="regular" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[15px] text-[14px]">
              {error}
            </div>
          )}

          {/* Botón Registrarse */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#CEFB48] text-[#131917] rounded-[15px] py-[10px] font-semibold text-[18px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-[30px]"
          >
            {isLoading ? 'Cargando...' : 'Registrarse'}
          </button>

          {/* Link iniciar sesión */}
          <div className="flex items-center justify-center gap-1 text-[12px] mt-[5px]">
            <span className="text-[#5A5B5A]">¿Ya tienes una cuenta?</span>
            <Link href="/login" className="bg-[#CEFB48] text-[#131917] px-3 py-1 rounded-[8px] font-semibold hover:opacity-90 transition-opacity">
              Iniciar sesión
            </Link>
          </div>
        </form>

        {/* Footer versión */}
        <div className="text-center mt-auto pt-6">
          <p className="text-[#5A5B5A] text-[12px]">v{APP_VERSION}</p>
        </div>
      </div>
    </div>
  );
}
