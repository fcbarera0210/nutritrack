'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SignOut, User as UserIcon, Target, Gear, PencilSimple, FloppyDisk, DownloadSimple, Bell } from '@phosphor-icons/react';
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
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="w-20 h-20 rounded-full bg-[#5FB75D] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          JD
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Juan Pérez</h1>
        <p className="text-gray-500">juan@ejemplo.com</p>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500 mb-1">Calorías Objetivo</p>
          <p className="text-xl font-bold text-[#5FB75D]">{profile.targetCalories}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500 mb-1">Proteína</p>
          <p className="text-xl font-bold text-[#5FB75D]">{profile.targetProtein}g</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500 mb-1">Peso</p>
          <p className="text-xl font-bold text-gray-900">{profile.weight} kg</p>
        </Card>
      </div>

      {/* Profile Form */}
      {isEditing && (
        <Card className="mb-6">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar Perfil</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSave} isLoading={isLoading}>
                  <FloppyDisk className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#5FB75D] focus:ring-2 focus:ring-[#5FB75D]/20"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Actividad</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#5FB75D] focus:ring-2 focus:ring-[#5FB75D]/20"
              >
                <option value="sedentary">Sedentario</option>
                <option value="lightly_active">Actividad Ligera</option>
                <option value="moderately_active">Actividad Moderada</option>
                <option value="very_active">Muy Activo</option>
                <option value="extra_active">Extra Activo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as any })}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#5FB75D] focus:ring-2 focus:ring-[#5FB75D]/20"
              >
                <option value="weight_loss">Pérdida de Peso</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="muscle_gain">Ganancia Muscular</option>
              </select>
            </div>
          </div>
        </Card>
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
      <Button
        variant="outline"
        fullWidth
        onClick={handleSignOut}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <SignOut className="w-5 h-5 mr-2" />
        Cerrar Sesión
      </Button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

