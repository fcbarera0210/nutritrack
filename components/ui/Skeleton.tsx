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
          <div className="flex items-center justify-between pt-[40px]">
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
    <div className="px-6 pt-6 pb-20 max-w-md mx-auto">
      {/* Título Objetivos actuales */}
      <Skeleton width="180px" height="24px" className="mb-5" />

      {/* Cards de Objetivos - Kcal y Peso */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Card Kcal - Grande - Ocupa 3/5 */}
        <div className="col-span-3 bg-white rounded-[30px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
          <Skeleton width="60px" height="24px" className="mb-2" />
          <Skeleton width="100px" height="32px" />
        </div>

        {/* Card Peso - Ocupa 2/5 */}
        <div className="col-span-2 bg-white rounded-[30px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
          <Skeleton width="50px" height="24px" className="mb-2" />
          <Skeleton width="60px" height="32px" />
        </div>
      </div>

      {/* Cards de Macros - Tres en fila */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-[30px] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
            <Skeleton width="70px" height="20px" className="mb-2" />
            <Skeleton width="50px" height="32px" />
          </div>
        ))}
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

