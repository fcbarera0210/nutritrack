'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SignOut, ArrowLeft, User as UserIcon, Target, PencilSimple, FloppyDisk, DownloadSimple, Bell } from '@phosphor-icons/react';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { calculateTDEE, calculateMacros } from '@/lib/utils/calories';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
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
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
      {/* Header oscuro */}
      <div className="bg-[#131917] rounded-b-[60px]">
        <div className="px-25 pt-[40px] pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center text-white hover:opacity-90 transition-colors flex-shrink-0">
              <ArrowLeft size={25} weight="bold" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#5FB75D] flex items-center justify-center text-[#131917] font-bold">JD</div>
              <div>
                <h1 className="text-white font-semibold text-[20px]">Perfil</h1>
                <p className="text-white/80 text-[14px]">Gestiona tu información y objetivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-[25px] pt-[25px] pb-[20px] max-w-md mx-auto">
        {/* Stats Quick View */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card padding="sm" className="text-center">
            <p className="text-xs text-[#5A5B5A] mb-1">Calorías</p>
            <p className="text-xl font-bold text-[#5FB75D]">{profile.targetCalories}</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-[#5A5B5A] mb-1">Proteína</p>
            <p className="text-xl font-bold text-[#5FB75D]">{profile.targetProtein}g</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-xs text-[#5A5B5A] mb-1">Peso</p>
            <p className="text-xl font-bold text-[#131917]">{profile.weight} kg</p>
          </Card>
        </div>

        {/* Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-[30px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.10)] mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#131917] text-[20px] font-semibold">Editar Perfil</h3>
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="text-[#DC3714] font-semibold text-[14px]">Cancelar</button>
                <button onClick={handleSave} disabled={isLoading} className="bg-[#CEFB48] text-[#131917] rounded-[10px] px-4 py-[8px] font-semibold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                  <FloppyDisk size={16} weight="bold" />
                  Guardar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Peso (kg)"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                min="30"
                max="300"
              />
              <Input
                type="number"
                label="Altura (cm)"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) })}
                min="100"
                max="250"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#131917] mb-2">Edad</label>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#131917] mb-2">Género</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none appearance-none"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#131917] mb-2">Nivel de Actividad</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none appearance-none"
              >
                <option value="sedentary">Sedentario</option>
                <option value="lightly_active">Actividad Ligera</option>
                <option value="moderately_active">Actividad Moderada</option>
                <option value="very_active">Muy Activo</option>
                <option value="extra_active">Extra Activo</option>
              </select>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#131917] mb-2">Objetivo</label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as any })}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none appearance-none"
              >
                <option value="weight_loss">Pérdida de Peso</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="muscle_gain">Ganancia Muscular</option>
              </select>
            </div>
          </div>
        )}

        {/* Menu Options - Only show when NOT editing */}
        {!isEditing && (
        <div className="space-y-2 mb-6">
          <Card padding="md" className="cursor-pointer hover:shadow-md transition-all" onClick={() => setIsEditing(true)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <PencilSimple className="w-5 h-5 text-gray-600" />
              </div>
              <p className="font-medium text-gray-900">Editar Perfil</p>
            </div>
          </Card>

          <Card padding="md" className="cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Objetivos</p>
                <p className="text-sm text-gray-500">{profile.targetCalories} kcal/día</p>
              </div>
            </div>
          </Card>

          <Card padding="md" className="cursor-pointer hover:shadow-md transition-all" onClick={handleExport}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <DownloadSimple className="w-5 h-5 text-gray-600" />
              </div>
              <p className="font-medium text-gray-900">Exportar Historial</p>
              {isExporting && <span className="text-sm text-gray-500">Exportando...</span>}
            </div>
          </Card>

          <Card padding="md" className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push('/profile/reminders')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </div>
              <p className="font-medium text-gray-900">Recordatorios</p>
            </div>
          </Card>
        </div>
        )}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full bg-white rounded-[15px] px-4 py-[12px] text-[#DC3714] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.10)] hover:opacity-90 transition-opacity"
        >
          <span className="inline-flex items-center gap-2"><SignOut size={18} weight="bold" /> Cerrar Sesión</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

