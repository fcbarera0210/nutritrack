'use client';

import { useState, useEffect } from 'react';
import { CaretDown, Fish, Grains, Avocado, Fire, Sparkle, CircleNotch, Lightbulb } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/Skeleton';

interface CustomFoodFormProps {
  food?: {
    id: number;
    name: string;
    brand: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
  };
  onSuccess?: (food: {
    id: number;
    name: string;
    brand: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize?: number;
    servingUnit?: string;
    isCustom?: boolean;
    userId?: number;
  }) => void;
  onCancel?: () => void;
}

export function CustomFoodForm({ food: initialFood, onSuccess, onCancel }: CustomFoodFormProps) {
  const isEditMode = !!initialFood;
  const [name, setName] = useState(initialFood?.name || '');
  const [brand, setBrand] = useState(initialFood?.brand || '');
  const [calories, setCalories] = useState(initialFood?.calories.toString() || '');
  const [protein, setProtein] = useState(initialFood?.protein.toString() || '');
  const [carbs, setCarbs] = useState(initialFood?.carbs.toString() || '');
  const [fat, setFat] = useState(initialFood?.fat.toString() || '');
  const [servingSize, setServingSize] = useState(initialFood?.servingSize.toString() || '100');
  const [servingUnit, setServingUnit] = useState(initialFood?.servingUnit || 'g');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSearchInfo, setAiSearchInfo] = useState<{ matchedFood: string; portionSize: string; portionUnit: string } | null>(null);
  const [searchesRemaining, setSearchesRemaining] = useState<number | null>(null);

  // Cargar contador de búsquedas al montar el componente
  useEffect(() => {
    const fetchSearchLimit = async () => {
      try {
        const response = await fetch('/api/foods/ai-search/limit');
        if (response.ok) {
          const data = await response.json();
          setSearchesRemaining(data.searchesRemaining);
        }
      } catch (error) {
        console.error('Error obteniendo límite de búsquedas:', error);
      }
    };
    fetchSearchLimit();
  }, []);

  const handleAISearch = async () => {
    if (!name.trim()) {
      setAiError('Por favor ingresa el nombre del alimento');
      return;
    }

    setIsSearchingAI(true);
    setAiError('');
    setError('');

    try {
      // Enviar también el tamaño de porción y unidad para que la IA pueda hacer cálculos más específicos
      const response = await fetch('/api/foods/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          foodName: name.trim(),
          servingSize: servingSize ? parseFloat(servingSize) : undefined,
          servingUnit: servingUnit || 'g'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar límite diario alcanzado (429)
        if (response.status === 429 && data.limitReached) {
          throw new Error(data.error || `Has alcanzado el límite diario de ${data.dailyLimit || 15} búsquedas por IA.`);
        }
        throw new Error(data.error || 'Error al buscar información por IA');
      }

      if (data.success && data.data) {
        // Verificar si todos los valores son 0 (no es un alimento)
        if (data.isZeroResult) {
          setAiError(`No se encontró información nutricional para "${name.trim()}". Esto podría indicar que no es un alimento comestible. Por favor, verifica el nombre e intenta nuevamente o ingresa los valores manualmente.`);
          setAiSearchInfo(null);
          // Limpiar los campos
          setCalories('');
          setProtein('');
          setCarbs('');
          setFat('');
        } else {
          // Llenar los campos con los datos obtenidos
          // Los valores ya vienen calculados para el tamaño de porción especificado
          setCalories(data.data.calories.toString());
          setProtein(data.data.protein.toString());
          setCarbs(data.data.carbs.toString());
          setFat(data.data.fat.toString());
          
          // Si viene un tamaño de porción sugerido y no se había establecido uno, actualizarlo
          if (data.data.servingSize && !servingSize) {
            setServingSize(data.data.servingSize.toString());
          }

          // Guardar información sobre la búsqueda
          setAiSearchInfo({
            matchedFood: data.data.matchedFood || name.trim(),
            portionSize: servingSize || data.data.servingSize?.toString() || '100',
            portionUnit: servingUnit || 'g'
          });

          // Actualizar contador de búsquedas restantes
          if (data.searchesRemaining !== undefined) {
            setSearchesRemaining(data.searchesRemaining);
          }

          // Limpiar cualquier error previo
          setAiError('');
          setError('');
        }
      } else {
        throw new Error('No se recibieron datos válidos de la IA');
      }
    } catch (error: any) {
      console.error('Error buscando por IA:', error);
      setAiError(error.message || 'Error al buscar información nutricional por IA');
      setAiSearchInfo(null);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAiSearchInfo(null); // Limpiar información de búsqueda al enviar

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
      const url = isEditMode ? `/api/foods/${initialFood!.id}` : '/api/foods/create';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
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
        throw new Error(data.error || (isEditMode ? 'Error al actualizar alimento personalizado' : 'Error al crear alimento personalizado'));
      }

      if (onSuccess) {
        onSuccess(data.food);
      }
    } catch (error: any) {
      setError(error.message || (isEditMode ? 'Error al actualizar alimento personalizado' : 'Error al crear alimento personalizado'));
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
        <p className="text-[#5A5B5A] text-xs mb-2">
          <Lightbulb size={14} weight="bold" className="text-[#5A5B5A] inline-block align-middle mr-1" />
          <span className="font-semibold">Tip:</span> Ajusta el tamaño de porción antes de buscar por IA para obtener resultados más precisos.
        </p>
        <label className="block text-[#131917] text-[14px] font-medium mb-2">
          Nombre del alimento *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: Ensalada de frutas"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              // Limpiar información de búsqueda cuando cambia el nombre
              if (aiSearchInfo) {
                setAiSearchInfo(null);
              }
            }}
            maxLength={100}
            className="flex-1 bg-white rounded-[15px] border-2 border-transparent px-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#3CCC1F] focus:shadow-none transition-all"
            required
            disabled={isSearchingAI}
          />
          <button
            type="button"
            onClick={handleAISearch}
            disabled={isSearchingAI || !name.trim() || (searchesRemaining !== null && searchesRemaining === 0)}
            className="bg-[#6484E2] text-white rounded-[15px] px-4 py-[10px] font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
            title={searchesRemaining === 0 ? "Has alcanzado el límite diario de búsquedas" : "Buscar información nutricional por IA"}
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
        {aiSearchInfo && !isSearchingAI && !aiError && (
          <div className="mt-2 bg-[#6484E2]/10 border-2 border-[#6484E2] rounded-[15px] px-4 py-3">
            <p className="text-[#6484E2] text-xs font-semibold">
              Búsqueda basada en: <span className="font-bold">{aiSearchInfo.matchedFood}</span> ({aiSearchInfo.portionSize}{aiSearchInfo.portionUnit})
            </p>
          </div>
        )}
        {searchesRemaining !== null && (
          <p className={`text-xs mt-2 ${searchesRemaining === 0 ? 'text-[#DC3714]' : 'text-[#5A5B5A]'}`}>
            Búsquedas restantes hoy: <span className={`font-semibold ${searchesRemaining === 0 ? 'text-[#DC3714]' : ''}`}>{searchesRemaining}/15</span>
            {searchesRemaining === 0 && (
              <span className="block mt-1 text-[#DC3714] text-xs">Has alcanzado el límite diario. Intenta nuevamente mañana.</span>
            )}
          </p>
        )}
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
            onChange={(e) => {
              setServingSize(e.target.value);
              // Limpiar información de búsqueda cuando cambia el tamaño de porción
              if (aiSearchInfo) {
                setAiSearchInfo(null);
              }
            }}
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
              onChange={(e) => {
                setServingUnit(e.target.value);
                // Limpiar información de búsqueda cuando cambia la unidad
                if (aiSearchInfo) {
                  setAiSearchInfo(null);
                }
              }}
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
              <span>{isEditMode ? 'Guardar' : 'Crear Alimento'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

