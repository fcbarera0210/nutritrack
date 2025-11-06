'use client';

import { useState } from 'react';
import { CaretDown, Fish, Grains, Avocado, Fire, Sparkle, CircleNotch } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/Skeleton';

interface CustomFoodFormProps {
  onSuccess?: (food: {
    id: number;
    name: string;
    brand: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  onCancel?: () => void;
}

export function CustomFoodForm({ onSuccess, onCancel }: CustomFoodFormProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('100');
  const [servingUnit, setServingUnit] = useState('g');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAISearch = async () => {
    if (!name.trim()) {
      setAiError('Por favor ingresa el nombre del alimento');
      return;
    }

    setIsSearchingAI(true);
    setAiError('');
    setError('');

    try {
      const response = await fetch('/api/foods/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar información por IA');
      }

      if (data.success && data.data) {
        // Llenar los campos con los datos obtenidos
        setCalories(data.data.calories.toString());
        setProtein(data.data.protein.toString());
        setCarbs(data.data.carbs.toString());
        setFat(data.data.fat.toString());
        
        // Si viene un tamaño de porción sugerido, actualizarlo
        if (data.data.servingSize) {
          setServingSize(data.data.servingSize.toString());
        }

        // Limpiar cualquier error previo
        setAiError('');
        setError('');
      } else {
        throw new Error('No se recibieron datos válidos de la IA');
      }
    } catch (error: any) {
      console.error('Error buscando por IA:', error);
      setAiError(error.message || 'Error al buscar información nutricional por IA');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!name.trim()) {
      setError('El nombre del alimento es requerido');
      return;
    }

    // Convertir valores vacíos a 0 para macros
    const caloriesValue = calories === '' || calories === null ? 0 : parseFloat(calories);
    const proteinValue = protein === '' || protein === null ? 0 : parseFloat(protein);
    const carbsValue = carbs === '' || carbs === null ? 0 : parseFloat(carbs);
    const fatValue = fat === '' || fat === null ? 0 : parseFloat(fat);

    // Validar que no sean negativos
    if (isNaN(caloriesValue) || caloriesValue < 0) {
      setError('Las calorías deben ser un número válido (mayor o igual a 0)');
      return;
    }

    if (isNaN(proteinValue) || proteinValue < 0) {
      setError('Las proteínas deben ser un número válido (mayor o igual a 0)');
      return;
    }

    if (isNaN(carbsValue) || carbsValue < 0) {
      setError('Los carbohidratos deben ser un número válido (mayor o igual a 0)');
      return;
    }

    if (isNaN(fatValue) || fatValue < 0) {
      setError('Las grasas deben ser un número válido (mayor o igual a 0)');
      return;
    }

    if (!servingSize || parseFloat(servingSize) <= 0) {
      setError('El tamaño de porción debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/foods/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          brand: brand.trim() || null,
          calories: caloriesValue,
          protein: proteinValue,
          carbs: carbsValue,
          fat: fatValue,
          servingSize: parseFloat(servingSize),
          servingUnit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear alimento personalizado');
      }

      if (onSuccess) {
        onSuccess(data.food);
      }
    } catch (error: any) {
      setError(error.message || 'Error al crear alimento personalizado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-6">
      {error && (
        <div className="bg-[#DC3714]/10 border-2 border-[#DC3714] text-[#DC3714] px-4 py-3 rounded-[15px] text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Nombre del alimento *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: Ensalada de frutas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
            required
            disabled={isSearchingAI}
          />
          <button
            type="button"
            onClick={handleAISearch}
            disabled={isSearchingAI || !name.trim()}
            className="bg-[#6484E2] text-white rounded-[15px] px-4 py-[10px] font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
            title="Buscar información nutricional por IA"
          >
            {isSearchingAI ? (
              <>
                <CircleNotch size={18} weight="bold" className="animate-spin" />
                <span className="hidden sm:inline">Buscando...</span>
              </>
            ) : (
              <>
                <Sparkle size={18} weight="bold" />
                <span className="hidden sm:inline">Buscar por IA</span>
              </>
            )}
          </button>
        </div>
        {aiError && (
          <p className="text-[#DC3714] text-xs mt-1">{aiError}</p>
        )}
        {isSearchingAI && (
          <div className="mt-2 bg-[#6484E2]/10 border-2 border-[#6484E2] rounded-[15px] px-4 py-3 flex items-center gap-3">
            <CircleNotch size={18} weight="bold" className="text-[#6484E2] animate-spin" />
            <span className="text-[#6484E2] text-sm font-semibold">
              Buscando información nutricional por IA...
            </span>
          </div>
        )}
      </div>

      {/* Marca (opcional) */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Marca (opcional)
        </label>
        <input
          type="text"
          placeholder="Ej: Marca propia"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
        />
      </div>

      {/* Tamaño de porción */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[#131917] text-[14px] font-medium mb-2">
            Tamaño de porción *
          </label>
          <input
            type="number"
            placeholder="100"
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            required
            min="0.1"
            step="0.1"
            className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
          />
        </div>
        <div>
          <label className="block text-[#131917] text-[14px] font-medium mb-2">
            Unidad *
          </label>
          <div className="relative">
            <select
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] pr-10 text-[#131917] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none appearance-none transition-all"
              required
            >
              <option value="g">g (gramos)</option>
              <option value="ml">ml (mililitros)</option>
              <option value="unit">unidad</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#5A5B5A]">
              <CaretDown size={20} weight="bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Información nutricional por {servingSize || '100'}{servingUnit} *
        </label>
        {isSearchingAI ? (
          // Estado de carga: mostrar skeleton y mensaje
          <div className="space-y-3">
            {/* Skeleton para los campos mientras carga */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Fire size={16} weight="bold" className="text-[#DC3714]" />
                <Skeleton width="100px" height="12px" className="bg-gray-200" />
              </div>
              <Skeleton width="100%" height="40px" className="rounded-[15px] bg-gray-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Fish size={16} weight="bold" className="text-[#3CCC1F]" />
                <Skeleton width="100px" height="12px" className="bg-gray-200" />
              </div>
              <Skeleton width="100%" height="40px" className="rounded-[15px] bg-gray-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Grains size={16} weight="bold" className="text-[#E5C438]" />
                <Skeleton width="100px" height="12px" className="bg-gray-200" />
              </div>
              <Skeleton width="100%" height="40px" className="rounded-[15px] bg-gray-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Avocado size={16} weight="bold" className="text-[#DC3714]" />
                <Skeleton width="100px" height="12px" className="bg-gray-200" />
              </div>
              <Skeleton width="100%" height="40px" className="rounded-[15px] bg-gray-200" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Calorías */}
            <div>
              <label className="block text-[#131917] text-[12px] font-medium mb-1 flex items-center gap-2">
                <Fire size={16} weight="bold" className="text-[#DC3714]" />
                Calorías (kcal)
              </label>
              <input
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
                step="0.1"
                disabled={isSearchingAI}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Proteínas */}
            <div>
              <label className="block text-[#131917] text-[12px] font-medium mb-1 flex items-center gap-2">
                <Fish size={16} weight="bold" className="text-[#3CCC1F]" />
                Proteínas (g)
              </label>
              <input
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="0.1"
                disabled={isSearchingAI}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Carbohidratos */}
            <div>
              <label className="block text-[#131917] text-[12px] font-medium mb-1 flex items-center gap-2">
                <Grains size={16} weight="bold" className="text-[#E5C438]" />
                Carbohidratos (g)
              </label>
              <input
                type="number"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="0.1"
                disabled={isSearchingAI}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Grasas */}
            <div>
              <label className="block text-[#131917] text-[12px] font-medium mb-1 flex items-center gap-2">
                <Avocado size={16} weight="bold" className="text-[#DC3714]" />
                Grasas (g)
              </label>
              <input
                type="number"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="0.1"
                disabled={isSearchingAI}
                className="w-full bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 pb-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 text-[#DC3714] font-semibold text-[16px] hover:opacity-90 transition-opacity"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="flex-1 bg-[#3CCC1F] text-[#131917] rounded-[15px] px-4 py-[10px] font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <span>Crear Alimento</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

