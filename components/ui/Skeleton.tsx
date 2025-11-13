'use client';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ width: width || '100%', height: height || '1rem' }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <>
      {/* Header + dark section wrapper */}
      <div className="bg-[#131917] rounded-b-[60px]">
        <div className="px-25 pb-[15px] flex flex-col gap-[30px]">
          {/* Header skeleton */}
          <div className="flex items-center justify-between pt-[24px]">
            <Skeleton width="48px" height="48px" className="rounded-full bg-white/10" />
            <Skeleton width="150px" height="24px" className="bg-white/20" />
            <Skeleton width="48px" height="48px" className="rounded-full bg-white/10" />
          </div>

          {/* Weekly Calendar skeleton */}
          <Skeleton width="100%" height="60px" className="rounded-[15px] bg-white/10" />

          {/* Kcal Box skeleton */}
          <div className="flex flex-col items-center">
            <Skeleton width="200px" height="36px" className="mb-2 bg-white/20" />
            <Skeleton width="120px" height="14px" className="bg-white/10" />
          </div>

          {/* Circular Macros skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton width="73px" height="73px" className="rounded-full bg-white/10" />
                <Skeleton width="60px" height="10px" className="mt-[10px] bg-white/10" />
                <Skeleton width="30px" height="8px" className="mt-1 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container pb-24 max-w-md mt-[25px]">
        {/* Activity and Hydration Cards skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-[30px] p-[10px] min-h-[100px] shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
              <Skeleton width="80px" height="32px" className="mb-3" />
              <Skeleton width="60px" height="14px" className="mb-2" />
              <Skeleton width="50px" height="14px" />
            </div>
          ))}
        </div>

        {/* Meals Section skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <Skeleton width="150px" height="24px" />
            <Skeleton width="38px" height="38px" className="rounded-full" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-[30px] px-[20px] py-[15px] mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
              <Skeleton width="100px" height="24px" className="mb-2" />
              <Skeleton width="80px" height="20px" className="mb-2" />
              <Skeleton width="200px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="px-6 pt-[25px] pb-20 max-w-md mx-auto">
      {/* Título Objetivos actuales */}
      <Skeleton width="180px" height="24px" className="mb-5" />

      {/* Cards de Objetivos - Kcal y Peso */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Card Kcal - Grande oscura - Ocupa 50% */}
        <div className="bg-[#131917] rounded-[30px] py-[10px] px-[15px] relative overflow-hidden">
          <Skeleton width="60px" height="24px" className="mb-2 bg-white/20" />
          <div className="flex items-baseline gap-1">
            <Skeleton width="100px" height="32px" className="bg-white/20" />
            <Skeleton width="40px" height="16px" className="bg-white/10" />
          </div>
        </div>

        {/* Card Peso - Blanca - Ocupa 50% */}
        <div className="bg-white rounded-[30px] py-[10px] px-[15px] relative overflow-hidden shadow-md">
          <Skeleton width="50px" height="24px" className="mb-2" />
          <div className="flex items-baseline gap-1">
            <Skeleton width="80px" height="28px" />
            <Skeleton width="30px" height="16px" />
          </div>
        </div>
      </div>

      {/* Cards de Macros - Tres en fila */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Proteínas - Verde */}
        <div className="bg-[#3CCC1F] rounded-[24px] py-[8px] px-[15px] relative overflow-hidden">
          <Skeleton width="70px" height="14px" className="mb-2 bg-[#131917]/20" />
          <div className="flex items-baseline gap-1">
            <Skeleton width="50px" height="32px" className="bg-[#131917]/20" />
            <Skeleton width="20px" height="16px" className="bg-[#131917]/10" />
          </div>
        </div>
        {/* Carbohidratos - Amarillo */}
        <div className="bg-[#E5C438] rounded-[24px] py-[8px] px-[15px] relative overflow-hidden">
          <Skeleton width="90px" height="14px" className="mb-2 bg-[#131917]/20" />
          <div className="flex items-baseline gap-1">
            <Skeleton width="50px" height="32px" className="bg-[#131917]/20" />
            <Skeleton width="20px" height="16px" className="bg-[#131917]/10" />
          </div>
        </div>
        {/* Grasas - Rojo */}
        <div className="bg-[#DC3714] rounded-[24px] py-[8px] px-[15px] relative overflow-hidden">
          <Skeleton width="50px" height="14px" className="mb-2 bg-white/20" />
          <div className="flex items-baseline gap-1">
            <Skeleton width="50px" height="32px" className="bg-white/20" />
            <Skeleton width="20px" height="16px" className="bg-white/10" />
          </div>
        </div>
      </div>

      {/* Botón de información sobre cálculos */}
      <Skeleton width="100%" height="40px" className="rounded-[15px] mb-6" />

      {/* Título Ajustes */}
      <Skeleton width="120px" height="24px" className="mb-4 mt-6" />

      {/* Botones de Ajustes */}
      <div className="space-y-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} width="100%" height="50px" className="rounded-[20px]" />
        ))}
      </div>
    </div>
  );
}

export function FoodListSkeleton() {
  return (
    <div className="space-y-3">
      {/* Título */}
      <Skeleton width="150px" height="14px" className="mb-2" />
      {/* Cards de alimentos */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-[#131917] rounded-[30px] px-[20px] py-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
          <div className="flex flex-col gap-3">
            {/* Fila 1: Nombre izquierda / Kcal derecha */}
            <div className="flex items-end justify-between">
              <Skeleton width="150px" height="20px" className="bg-white/20" />
              <div className="flex items-baseline gap-2 ml-4">
                <Skeleton width="60px" height="32px" className="bg-white/20" />
                <Skeleton width="30px" height="16px" className="bg-white/10" />
              </div>
            </div>
            {/* Fila 2: 100g izquierda / Macros derecha */}
            <div className="flex items-center justify-between">
              <Skeleton width="40px" height="14px" className="bg-white/10" />
              <div className="flex items-center gap-4">
                <Skeleton width="50px" height="14px" className="bg-white/10" />
                <Skeleton width="50px" height="14px" className="bg-white/10" />
                <Skeleton width="50px" height="14px" className="bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="min-h-screen bg-[#D9D9D9] pb-24">
      {/* Header oscuro con ícono de perfil y textos */}
      <div className="bg-[#131917] rounded-b-[30px]">
        <div className="px-25 pb-[15px] pt-[24px]">
          <div className="flex items-center gap-4">
            {/* User Avatar skeleton */}
            <Skeleton width="48px" height="48px" className="rounded-full bg-white/10" />
            {/* Título y descripción skeleton */}
            <div className="flex-1">
              <Skeleton width="120px" height="24px" className="mb-2 bg-white/20" />
              <Skeleton width="180px" height="16px" className="bg-white/10" />
            </div>
          </div>
        </div>
        
        {/* Navegador de semanas skeleton */}
        <div className="px-6 pb-4">
          <div className="bg-[#404040] rounded-[30px] pt-[15px] pr-[20px] pb-[10px] pl-[20px]">
            <div className="flex items-center justify-between">
              <Skeleton width="150px" height="20px" className="bg-white/10" />
              <div className="flex items-center gap-3">
                <Skeleton width="28px" height="28px" className="rounded-full bg-white/10" />
                <Skeleton width="28px" height="28px" className="rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-20 max-w-md mx-auto">
        {/* Summary Cards skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Card Promedio Semanal - Oscura */}
          <div className="bg-[#131917] rounded-[30px] py-[10px] px-[15px] relative overflow-hidden">
            <Skeleton width="100px" height="14px" className="mb-2 bg-white/20" />
            <div className="flex items-baseline gap-1">
              <Skeleton width="80px" height="32px" className="bg-white/20" />
              <Skeleton width="40px" height="16px" className="bg-white/10" />
            </div>
          </div>

          {/* Card Total Registrado - Blanca */}
          <div className="bg-white rounded-[30px] py-[10px] px-[15px] relative overflow-hidden shadow-md">
            <Skeleton width="100px" height="14px" className="mb-2" />
            <div className="flex items-baseline gap-1">
              <Skeleton width="60px" height="32px" />
              <Skeleton width="60px" height="16px" />
            </div>
          </div>
        </div>

        {/* Charts Section skeleton */}
        <div className="mb-6">
          <Skeleton width="150px" height="24px" className="mb-4" />
          <Skeleton width="100%" height="300px" className="rounded-lg" />
          
          {/* Botón skeleton */}
          <Skeleton width="100%" height="44px" className="rounded-[15px] mt-4" />
        </div>

        {/* Entrenamientos recientes skeleton */}
        <div className="mb-6">
          <Skeleton width="180px" height="24px" className="mb-4" />
          
          {/* Card amarilla con total semanal skeleton */}
          <Skeleton width="100%" height="50px" className="rounded-[15px] mb-3" />
          
          {/* Cards de ejercicios skeleton */}
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#131917] rounded-[15px] p-4">
                <div className="flex flex-col gap-3">
                  {/* Fila 1: Nombre del ejercicio y kcal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Skeleton width="18px" height="18px" className="bg-white/20 rounded" />
                      <Skeleton width="120px" height="18px" className="bg-white/20" />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Skeleton width="60px" height="20px" className="bg-white/20" />
                      <Skeleton width="30px" height="14px" className="bg-white/10" />
                    </div>
                  </div>
                  {/* Fila 2: Duración y fecha */}
                  <div className="flex items-center justify-between">
                    <Skeleton width="100px" height="14px" className="bg-white/10" />
                    <Skeleton width="80px" height="14px" className="bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón de información skeleton */}
          <Skeleton width="100%" height="44px" className="rounded-[15px] mt-4" />
        </div>
      </div>
    </div>
  );
}

