'use client';

interface MealCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  itemCount: number;
  items?: Array<{
    id: number;
    name: string;
    calories: number;
    quantity: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  onClick: () => void;
}

const mealLabels = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snacks',
};

export function MealCard({ mealType, calories, itemCount, items = [], onClick }: MealCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#131917] rounded-[30px] px-[20px] py-[15px] mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.10)] cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-semibold text-[24px] leading-tight">{mealLabels[mealType]}</p>
        {/* Calorías totales */}
        <div className="flex items-center gap-1">
          <span className="text-white font-semibold text-[24px] leading-none">{calories}</span>
          <span className="text-white/90 font-light text-base leading-none ml-[2px]">kcal</span>
        </div>
      </div>

      {/* Lista de alimentos */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.slice(0, 3).map((item) => {
            const itemCalories = Math.round(item.calories * item.quantity / 100);
            
            return (
              <div key={item.id} className="flex items-center justify-between py-1">
                <span className="text-white text-sm font-medium truncate flex-1 pr-2">{item.name}</span>
                {/* Calorías */}
                <span className="text-white/70 text-xs whitespace-nowrap">
                  {itemCalories} kcal
                </span>
              </div>
            );
          })}
          {items.length > 3 && (
            <p className="text-white/70 text-xs pt-1">+{items.length - 3} más</p>
          )}
        </div>
      ) : (
        <p className="text-white/50 text-sm">No hay alimentos registrados</p>
      )}
    </div>
  );
}
