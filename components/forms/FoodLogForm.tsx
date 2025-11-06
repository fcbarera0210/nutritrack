'use client';

import { useState } from 'react';
import { CaretDown, Fish, Grains, Avocado } from '@phosphor-icons/react';
import { getTodayDateLocal } from '@/lib/utils/date';

interface FoodLogFormProps {
  food: {
    id: number;
    name: string;
    brand: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Almuerzo' },
  { value: 'dinner', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
];

export function FoodLogForm({ food, onSuccess, onCancel }: FoodLogFormProps) {
  const [quantity, setQuantity] = useState('100');
  const [mealType, setMealType] = useState('breakfast');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/logs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodId: food.id,
          quantity: parseFloat(quantity),
          servingSize: 100, // Default serving size en gramos
          mealType,
          date: getTodayDateLocal(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar alimento');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar alimento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedCalories = Math.round((food.calories * parseFloat(quantity)) / 100);
  const calculatedProtein = ((food.protein * parseFloat(quantity)) / 100).toFixed(1);
  const calculatedCarbs = ((food.carbs * parseFloat(quantity)) / 100).toFixed(1);
  const calculatedFat = ((food.fat * parseFloat(quantity)) / 100).toFixed(1);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[15px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cantidad y Tipo de Comida en una fila */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[#131917] text-[14px] font-medium mb-2">
              Cantidad (g)
            </label>
            <input
              type="number"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              step="0.1"
              className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[#131917] text-[14px] font-medium mb-2">
              Tipo de Comida
            </label>
            <div className="relative">
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all [&:focus]:shadow-none"
            >
                {MEAL_TYPES.map(meal => (
                  <option key={meal.value} value={meal.value}>
                    {meal.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
                <CaretDown size={20} weight="bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Valores Calculados - Fondo oscuro y horizontal */}
        <div className="bg-[#131917] rounded-[15px] p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1 text-[#3CCC1F] text-[14px]">
              <Fish size={18} weight="bold" />
              <span>{calculatedProtein}g</span>
            </div>
            <div className="flex items-center gap-1 text-[#E5C438] text-[14px]">
              <Grains size={18} weight="bold" />
              <span>{calculatedCarbs}g</span>
            </div>
            <div className="flex items-center gap-1 text-[#DC3714] text-[14px]">
              <Avocado size={18} weight="bold" />
              <span>{calculatedFat}g</span>
            </div>
            <div className="flex items-baseline gap-2 ml-auto">
              <span className="text-white font-semibold text-[32px] leading-none">{calculatedCalories}</span>
              <span className="text-white/70 text-[16px] leading-none">kcal</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 text-[#DC3714] font-semibold text-[16px] hover:opacity-90 transition-opacity"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#3CCC1F] text-[#131917] rounded-[15px] px-4 py-[10px] font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
}
