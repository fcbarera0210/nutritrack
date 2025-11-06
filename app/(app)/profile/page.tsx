'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { CalculationInfo } from '@/components/ui/CalculationInfo';
import { SignOut, ArrowLeft, User as UserIcon, Target, PencilSimple, FloppyDisk, DownloadSimple, Bell, Info, X, CloudArrowDown, HandWaving, Fire, Speedometer, Fish, Grains, Avocado, WarningCircle, CaretDown } from '@phosphor-icons/react';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { calculateTDEE, calculateMacros } from '@/lib/utils/calories';
import { APP_VERSION } from '@/lib/constants';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Valores por defecto
  const defaultProfile = {
    weight: 70,
    height: 170,
    age: 30,
    gender: 'male' as 'male' | 'female' | 'other',
    activityLevel: 'moderately_active',
    goal: 'maintenance' as 'weight_loss' | 'maintenance' | 'muscle_gain',
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 67,
  };
  
  const [profile, setProfile] = useState<{
    name: string | null;
    email: string | null;
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activityLevel: string;
    goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    manualTargets: boolean;
    targetWeight: number | null;
    preferredSports: string[];
    dietaryPreferences: string[];
    foodAllergies: string | null;
    bio: string | null;
    phone: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch('/api/user/profile');
      
      // Si la respuesta es 401 o 403, redirigir al login
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        // Debug: Log para ver qué datos llegan
        console.log('Datos recibidos del servidor:', data);
        
        // Función helper para convertir valores numéricos y manejar null/undefined
        const getNumericValue = (value: any, defaultValue: number): number => {
          if (value === null || value === undefined || value === '') return defaultValue;
          const num = typeof value === 'string' ? parseFloat(value) : value;
          return isNaN(num) ? defaultValue : num;
        };
        
        // Mergear datos del servidor con valores por defecto, preservando valores por defecto cuando los datos son null/undefined
        const mergedProfile = {
          name: data.name ?? null,
          email: data.email ?? null,
          weight: getNumericValue(data.weight, defaultProfile.weight),
          height: getNumericValue(data.height, defaultProfile.height),
          age: getNumericValue(data.age, defaultProfile.age),
          gender: (data.gender || defaultProfile.gender) as 'male' | 'female' | 'other',
          activityLevel: data.activityLevel || defaultProfile.activityLevel,
          goal: (data.goal || defaultProfile.goal) as 'weight_loss' | 'maintenance' | 'muscle_gain',
          targetCalories: getNumericValue(data.targetCalories, defaultProfile.targetCalories),
          targetProtein: getNumericValue(data.targetProtein, defaultProfile.targetProtein),
          targetCarbs: getNumericValue(data.targetCarbs, defaultProfile.targetCarbs),
          targetFat: getNumericValue(data.targetFat, defaultProfile.targetFat),
          manualTargets: data.manualTargets ?? false,
          targetWeight: data.targetWeight ?? null,
          preferredSports: Array.isArray(data.preferredSports) ? data.preferredSports : [],
          dietaryPreferences: Array.isArray(data.dietaryPreferences) ? data.dietaryPreferences : [],
          foodAllergies: data.foodAllergies ?? null,
          bio: data.bio ?? null,
          phone: data.phone ? (() => {
            // Si el teléfono tiene prefijo +56, removerlo para mostrar solo los dígitos
            const phone = data.phone.replace(/\D/g, '');
            if (phone.startsWith('56') && phone.length === 11) {
              return phone.substring(2); // Remover el 56, dejar solo los 9 dígitos
            }
            return phone.length > 9 ? phone.substring(phone.length - 9) : phone;
          })() : null,
        };
        
        console.log('Perfil merged:', mergedProfile);
        setProfile(mergedProfile);
      } else {
        console.error('Error fetching profile:', data.error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Formatear teléfono con prefijo +56 si tiene valor
      const profileToSave = { ...profile };
      if (profileToSave.phone && profileToSave.phone.trim()) {
        // Asegurar que solo tenga números y máximo 9 dígitos
        const phoneNumbers = profileToSave.phone.replace(/\D/g, '').substring(0, 9);
        if (phoneNumbers.length === 9) {
          profileToSave.phone = `+56${phoneNumbers}`;
        } else if (phoneNumbers.length > 0) {
          // Si tiene menos de 9 dígitos pero tiene valor, guardarlo sin prefijo
          profileToSave.phone = phoneNumbers;
        } else {
          profileToSave.phone = null;
        }
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSave),
      });

      if (response.ok) {
        setIsEditing(false);
        await fetchProfile(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Usar window.location para forzar recarga completa y funcionar en PWA
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir al login si hay error
      window.location.href = '/login';
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/history?days=30');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutritrack-historial-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar datos');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] pb-24">
      {/* Header oscuro con información del usuario */}
      {isLoadingProfile ? (
        <div className="bg-[#131917] rounded-b-[30px] px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-5 bg-white/20 animate-pulse rounded" />
                <div className="w-40 h-4 bg-white/10 animate-pulse rounded" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      ) : profile ? (
        <div className="bg-[#131917] rounded-b-[30px] px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Foto de perfil circular */}
              <div className="w-16 h-16 rounded-full bg-[#404040] flex items-center justify-center text-white font-bold text-xl">
                {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'JD'}
              </div>
              {/* Información del usuario */}
              <div>
                <h1 className="text-white font-semibold text-lg inline-flex items-center gap-2">
                  {profile.name || 'Usuario'}
                  <span className="animate-color-wave">
                    <HandWaving size={16} weight="bold" />
                  </span>
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  {profile.email || 'Sin email'}
                </p>
              </div>
            </div>
            {/* Botón de logout */}
            <button
              onClick={handleSignOut}
              className="w-12 h-12 rounded-full bg-[#F44336] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <SignOut size={20} weight="bold" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Contenido */}
      {isLoadingProfile ? (
        <ProfileSkeleton />
      ) : profile ? (
        <div className="px-6 pt-6 pb-20 max-w-md mx-auto">
          {/* Título Objetivos actuales - Solo visible cuando NO se está editando */}
          {!isEditing && (
            <>
              <h2 className="text-[#131917] font-semibold text-xl mb-5">Objetivos actuales</h2>

              {/* Cards de Objetivos */}
              <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Card Kcal - Grande oscura - Ocupa 50% */}
            <div className="bg-[#131917] rounded-[30px] py-[10px] px-[15px] relative overflow-hidden">
              {/* Ícono de fondo */}
              <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(255, 255, 255, 0.2))' }}>
                <Fire weight="bold" className="text-white" style={{ width: 100, height: 85 }} />
              </div>
              {/* Contenido */}
              <div className="relative z-10 flex flex-col justify-center h-full">
                <p className="text-white truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '24px', fontWeight: 500, lineHeight: '1' }}>Kcal</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-white leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>{profile.targetCalories}</p>
                  <p className="text-white leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>kcal</p>
                </div>
              </div>
            </div>

            {/* Card Peso - Blanca - Ocupa 50% */}
            <div className="bg-white rounded-[30px] py-[10px] px-[15px] relative overflow-hidden shadow-md">
              {/* Ícono de fondo */}
              <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2))' }}>
                <Speedometer weight="bold" className="text-[#131917]" style={{ width: 100, height: 85 }} />
              </div>
              {/* Contenido */}
              <div className="relative z-10 flex flex-col justify-center h-full">
                <p className="text-[#131917] truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '24px', fontWeight: 500, lineHeight: '1' }}>Peso</p>
                <div className="flex items-baseline gap-0.5">
                  {/* Peso actual */}
                  <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '28px', fontWeight: 500, lineHeight: '1.3' }}>{profile.weight || '-'}</p>
                  {/* Separador y peso objetivo */}
                  {profile.targetWeight && (
                    <>
                      <span className="text-[#5A5B5A] leading-none mx-0.5" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '28px', fontWeight: 400, lineHeight: '1.3' }}>/</span>
                      <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>
                        {profile.targetWeight}
                      </p>
                    </>
                  )}
                  <p className="text-[#5A5B5A] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Macros - Tres en fila */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Proteínas - Verde */}
            <div className="bg-[#3CCC1F] rounded-[24px] py-[8px] px-[15px] relative overflow-hidden">
              {/* Ícono de fondo */}
              <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2))' }}>
                <Fish weight="bold" className="text-white" style={{ width: 70, height: 60 }} />
              </div>
              {/* Contenido */}
              <div className="relative z-10 text-left flex flex-col justify-center h-full">
                <p className="text-[#131917] truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '1' }}>Proteínas</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>{profile.targetProtein}</p>
                  <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>g</p>
                </div>
              </div>
            </div>

            {/* Carbohidratos - Amarillo */}
            <div className="bg-[#E5C438] rounded-[24px] py-[8px] px-[15px] relative overflow-hidden">
              {/* Ícono de fondo */}
              <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2))' }}>
                <Grains weight="bold" className="text-white" style={{ width: 70, height: 60 }} />
              </div>
              {/* Contenido */}
              <div className="relative z-10 text-left flex flex-col justify-center h-full">
                <p className="text-[#131917] truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '1' }}>Carbohidratos</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>{profile.targetCarbs}</p>
                  <p className="text-[#131917] leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>g</p>
                </div>
              </div>
            </div>

            {/* Grasas - Rojo */}
            <div className="bg-[#DC3714] rounded-[24px] py-[8px] px-[15px] relative overflow-hidden">
              {/* Ícono de fondo */}
              <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2))' }}>
                <Avocado weight="bold" className="text-white" style={{ width: 70, height: 60 }} />
              </div>
              {/* Contenido */}
              <div className="relative z-10 text-left flex flex-col justify-center h-full">
                <p className="text-white truncate" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '1' }}>Grasas</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-white leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '32px', fontWeight: 700, lineHeight: '1.3' }}>{profile.targetFat}</p>
                  <p className="text-white leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: '1.3' }}>g</p>
                </div>
              </div>
            </div>
          </div>

              {/* Botón de información sobre cálculos */}
              <button
                onClick={() => setShowCalculationInfo(true)}
                className="w-full bg-[#6484E2] rounded-[15px] px-4 py-2 text-white font-semibold mb-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <WarningCircle size={18} weight="bold" />
                <span>¿Cómo se calculan tus objetivos?</span>
              </button>
            </>
          )}

        {/* Profile Form */}
        {isEditing && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">

              {/* Sección: Información Personal */}
              <div className="space-y-4">
                <h4 className="text-[16px] font-semibold text-[#131917]">Información Personal</h4>
                
                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value || null })}
                    placeholder="Tu nombre completo"
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => {
                      // Solo permitir números
                      const value = e.target.value.replace(/\D/g, '');
                      // Máximo 9 dígitos
                      if (value.length <= 9) {
                        setProfile({ ...profile, phone: value || null });
                      }
                    }}
                    placeholder="Ej: 912345678"
                    maxLength={9}
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                  />
                  <p className="text-xs text-[#5A5B5A] mt-1">
                    Solo números, máximo 9 dígitos. El prefijo +56 se agregará automáticamente.
                  </p>
                </div>
              </div>

              {/* Datos Físicos */}
              <div className="space-y-4">
                <h4 className="text-[16px] font-semibold text-[#131917]">Datos Físicos</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#131917] text-[14px] font-medium mb-2">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                      min="30"
                      max="300"
                      className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#131917] text-[14px] font-medium mb-2">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) })}
                      min="100"
                      max="250"
                      className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                    min="1"
                    max="120"
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Género
                  </label>
                  <div className="relative">
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                      className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all [&:focus]:shadow-none"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
                      <CaretDown size={20} weight="bold" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Nivel de Actividad
                  </label>
                  <div className="relative">
                    <select
                      value={profile.activityLevel}
                      onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                      className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all [&:focus]:shadow-none"
                    >
                      <option value="sedentary">Sedentario</option>
                      <option value="lightly_active">Actividad Ligera</option>
                      <option value="moderately_active">Actividad Moderada</option>
                      <option value="very_active">Muy Activo</option>
                      <option value="extra_active">Extra Activo</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
                      <CaretDown size={20} weight="bold" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Objetivo
                  </label>
                  <div className="relative">
                    <select
                      value={profile.goal}
                      onChange={(e) => setProfile({ ...profile, goal: e.target.value as any })}
                      className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all [&:focus]:shadow-none"
                    >
                      <option value="weight_loss">Pérdida de Peso</option>
                      <option value="maintenance">Mantenimiento</option>
                      <option value="muscle_gain">Ganancia Muscular</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
                      <CaretDown size={20} weight="bold" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Objetivos Nutricionales */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[16px] font-semibold text-[#131917]">Objetivos Nutricionales</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.manualTargets}
                      onChange={(e) => setProfile({ ...profile, manualTargets: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#3CCC1F] checked:border-[#3CCC1F] focus:ring-2 focus:ring-[#3CCC1F] transition-colors"
                    />
                    <span className="text-[12px] text-[#5A5B5A]">Editar manualmente</span>
                  </label>
                </div>

                {profile.manualTargets ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#131917] text-[14px] font-medium mb-2">
                        Calorías (kcal)
                      </label>
                      <input
                        type="number"
                        value={profile.targetCalories}
                        onChange={(e) => setProfile({ ...profile, targetCalories: parseFloat(e.target.value) || 0 })}
                        min="0"
                        className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[#131917] text-[14px] font-medium mb-2">
                        Peso Objetivo (kg)
                      </label>
                      <input
                        type="number"
                        value={profile.targetWeight || ''}
                        onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value ? parseFloat(e.target.value) : null })}
                        min="0"
                        className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[#131917] text-[14px] font-medium mb-2">
                        Proteína (g)
                      </label>
                      <input
                        type="number"
                        value={profile.targetProtein}
                        onChange={(e) => setProfile({ ...profile, targetProtein: parseFloat(e.target.value) || 0 })}
                        min="0"
                        className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[#131917] text-[14px] font-medium mb-2">
                        Carbohidratos (g)
                      </label>
                      <input
                        type="number"
                        value={profile.targetCarbs}
                        onChange={(e) => setProfile({ ...profile, targetCarbs: parseFloat(e.target.value) || 0 })}
                        min="0"
                        className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[#131917] text-[14px] font-medium mb-2">
                        Grasas (g)
                      </label>
                      <input
                        type="number"
                        value={profile.targetFat}
                        onChange={(e) => setProfile({ ...profile, targetFat: parseFloat(e.target.value) || 0 })}
                        min="0"
                        className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#5A5B5A] bg-gray-50 rounded-[15px] p-3">
                    Los objetivos se calcularán automáticamente según tus datos físicos y objetivo. 
                    Activa "Editar manualmente" para establecer valores personalizados.
                  </p>
                )}
              </div>

              {/* Sección: Información Adicional */}
              <div className="space-y-4">
                <h4 className="text-[16px] font-semibold text-[#131917]">Información Adicional</h4>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Peso Objetivo (kg)
                  </label>
                  <input
                    type="number"
                    value={profile.targetWeight || ''}
                    onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value ? parseFloat(e.target.value) : null })}
                    min="0"
                    placeholder="Ej: 65"
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Deportes Preferidos
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.preferredSports.map((sport, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-[#3CCC1F] text-[#131917] rounded-full px-3 py-1 text-[12px] font-medium"
                      >
                        {sport}
                        <button
                          type="button"
                          onClick={() => {
                            const newSports = profile.preferredSports.filter((_, i) => i !== index);
                            setProfile({ ...profile, preferredSports: newSports });
                          }}
                          className="hover:opacity-70"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Escribe un deporte y presiona Enter"
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value && !profile.preferredSports.includes(value)) {
                          setProfile({ ...profile, preferredSports: [...profile.preferredSports, value] });
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Preferencias Alimentarias
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.dietaryPreferences.map((pref, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-[#5FB75D] text-white rounded-full px-3 py-1 text-[12px] font-medium"
                      >
                        {pref}
                        <button
                          type="button"
                          onClick={() => {
                            const newPrefs = profile.dietaryPreferences.filter((_, i) => i !== index);
                            setProfile({ ...profile, dietaryPreferences: newPrefs });
                          }}
                          className="hover:opacity-70"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select
                      className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all [&:focus]:shadow-none"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !profile.dietaryPreferences.includes(value)) {
                          setProfile({ ...profile, dietaryPreferences: [...profile.dietaryPreferences, value] });
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Selecciona una preferencia</option>
                      <option value="vegetariano">Vegetariano</option>
                      <option value="vegano">Vegano</option>
                      <option value="sin_gluten">Sin Gluten</option>
                      <option value="sin_lactosa">Sin Lactosa</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                      <option value="low_carb">Bajo en Carbohidratos</option>
                      <option value="bajo_en_sodio">Bajo en Sodio</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
                      <CaretDown size={20} weight="bold" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Alergias Alimentarias
                  </label>
                  <textarea
                    value={profile.foodAllergies || ''}
                    onChange={(e) => setProfile({ ...profile, foodAllergies: e.target.value || null })}
                    placeholder="Ej: Alergia a maní, mariscos, etc."
                    rows={3}
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none resize-none transition-all"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-[#131917] text-[14px] font-medium mb-2">
                    Sobre mí (Bio)
                  </label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value || null })}
                    placeholder="Escribe algo sobre ti..."
                    rows={3}
                    className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none resize-none transition-all"
                    maxLength={500}
                  />
                  <p className="text-xs text-[#5A5B5A] mt-1">
                    {(profile.bio || '').length}/500 caracteres
                  </p>
                </div>
              </div>

              {/* Botones de acción al final */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 text-[#DC3714] font-semibold text-[16px] hover:opacity-90 transition-opacity"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#3CCC1F] text-[#131917] rounded-[15px] px-4 py-[10px] font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
        )}

          {/* Título Ajustes */}
          {!isEditing && (
            <>
              <h2 className="text-[#131917] font-semibold text-xl mb-4 mt-6">Ajustes</h2>

              {/* Botones de Ajustes */}
              <div className="space-y-3 mb-6">
                {/* Editar Perfil */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#131917] rounded-[20px] px-4 py-[10px] text-white font-semibold flex items-center justify-between hover:opacity-90 transition-opacity"
                >
                  <span>Editar Perfil</span>
                  <PencilSimple size={40} weight="bold" className="opacity-20" />
                </button>

                {/* Recordatorios - Oculto temporalmente */}
                {/* <button
                  onClick={() => router.push('/profile/reminders')}
                  className="w-full bg-[#131917] rounded-[20px] px-4 py-[10px] text-white font-semibold flex items-center justify-between hover:opacity-90 transition-opacity"
                >
                  <span>Recordatorios</span>
                  <Bell size={40} weight="bold" className="opacity-20" />
                </button> */}

                {/* Exportar Historial */}
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-[#131917] rounded-[20px] px-4 py-[10px] text-white font-semibold flex items-center justify-between hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span>{isExporting ? 'Exportando...' : 'Exportar Historial'}</span>
                  <CloudArrowDown size={40} weight="bold" className="opacity-20" />
                </button>

                {/* Cerrar Sesión */}
                <button
                  onClick={handleSignOut}
                  className="w-full bg-white rounded-[20px] px-4 py-[10px] text-[#F44336] font-semibold flex items-center justify-center hover:opacity-90 transition-opacity border-2 border-transparent hover:border-[#F44336]"
                >
                  <span className="flex items-center gap-2">
                    <SignOut size={18} weight="bold" />
                    Cerrar Sesión
                  </span>
                </button>
                
                {/* Versión */}
                <div className="text-center pt-2">
                  <p className="text-[#5A5B5A] text-[12px]">v{APP_VERSION}</p>
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modal de información sobre cálculos */}
      <CalculationInfo isOpen={showCalculationInfo} onClose={() => setShowCalculationInfo(false)} />
    </div>
  );
}

