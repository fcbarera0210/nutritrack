'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

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
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
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
    <Card className="p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-[#5FB75D] to-[#4A9244] p-4 text-white">
        <h3 className="font-semibold text-lg">{food.name}</h3>
        {food.brand && <p className="text-sm opacity-90">{food.brand}</p>}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad (gramos)
          </label>
          <Input
            type="number"
            placeholder="100"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Comida
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-[#5FB75D] focus:ring-2 focus:ring-[#5FB75D]/20 transition-all duration-200"
          >
            {MEAL_TYPES.map(meal => (
              <option key={meal.value} value={meal.value}>
                {meal.label}
              </option>
            ))}
          </select>
        </div>

        {/* Calculated Values Preview */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Valores calculados:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Calorías:</span>
              <span className="ml-2 font-semibold text-gray-900">{calculatedCalories} kcal</span>
            </div>
            <div>
              <span className="text-gray-500">Proteína:</span>
              <span className="ml-2 font-semibold text-gray-900">{calculatedProtein}g</span>
            </div>
            <div>
              <span className="text-gray-500">Carbohidratos:</span>
              <span className="ml-2 font-semibold text-gray-900">{calculatedCarbs}g</span>
            </div>
            <div>
              <span className="text-gray-500">Grasas:</span>
              <span className="ml-2 font-semibold text-gray-900">{calculatedFat}g</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" fullWidth onClick={onCancel} type="button">
              Cancelar
            </Button>
          )}
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Registrar Alimento
          </Button>
        </div>
      </form>
    </Card>
  );
}

