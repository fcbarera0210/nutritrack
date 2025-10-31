'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, Plus, ArrowLeft, Info, Fish, Bread, Avocado, Star } from '@phosphor-icons/react';
import { FoodLogForm } from '@/components/forms/FoodLogForm';
import { ExerciseForm } from '@/components/forms/ExerciseForm';
import { BottomNav } from '@/components/dashboard/BottomNav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categories, categorizeFood } from '@/lib/utils/categories';

interface FoodItem {
  id: number;
  name: string;
  brand: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function AddPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Cargar todos los alimentos al inicio
    handleSearch('');
  }, []);

  useEffect(() => {
    // Cerrar tooltip al hacer click fuera
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-category-info]')) {
        setShowCategoryTooltip(false);
      }
    };

    if (showCategoryTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCategoryTooltip]);

  // IntersectionObserver para carga incremental
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= searchResults.length) return prev;
            return Math.min(prev + 15, searchResults.length);
          });
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchResults]);

  const handleSearch = async (query: string, categoryId?: string) => {
    const category = categoryId !== undefined ? categoryId : selectedCategory;
    setSearchQuery(query);
    setIsSearching(true);
    
    try {
      const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Filtrar por categoría si no es "todos" o "favoritos"
      if (category === 'todos') {
        setSearchResults(data);
        setVisibleCount(15);
      } else if (category === 'favoritos') {
        // TODO: Implementar lógica de favoritos
        setSearchResults([]);
        setVisibleCount(15);
      } else {
        const filtered = data.filter((food: FoodItem) => {
          const foodCategoryId = categorizeFood(food.name);
          return foodCategoryId === category;
        });
        setSearchResults(filtered);
        setVisibleCount(15);
      }
    } catch (error) {
      console.error('Error buscando alimentos:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleSearch(searchQuery, categoryId);
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] pb-24">
      {/* Header oscuro con botón volver, título y descripción */}
      <div className="bg-[#131917] rounded-b-[60px]">
        <div className="px-25 pt-[40px] pb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="w-12 h-12 rounded-full bg-[#404040] flex items-center justify-center text-white hover:opacity-90 transition-colors flex-shrink-0">
                <ArrowLeft size={25} weight="bold" />
              </button>
            </Link>
            <div className="flex-1">
              <h2 className="text-white font-semibold text-[20px]">Agregar Alimento</h2>
              <p className="text-white/80 text-[14px]">
                Busca o crea un alimento para registrar tu consumo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-[25px] pt-[25px] pb-[20px]">

        {/* Search Bar */}
        {!selectedFood && !showExerciseForm && (
          <div className="mb-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A5B5A]">
                <MagnifyingGlass size={20} weight="regular" />
              </div>
              <input
                type="text"
                placeholder="Buscar alimentos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white rounded-[15px] border-2 border-transparent pl-[50px] pr-4 py-[10px] text-[#131917] placeholder-[#D9D9D9] text-[16px] font-semibold focus:outline-none focus:border-[#CEFB48] focus:shadow-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Category Filters */}
        {!selectedFood && !showExerciseForm && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#131917] text-[14px] font-bold">Filtrar por categoría:</p>
              <button
                onClick={() => setShowCategoryTooltip(!showCategoryTooltip)}
                className="relative"
                data-category-info
              >
                <Info size={20} weight="bold" color="#6484e2" />
                {showCategoryTooltip && (
                  <div className="absolute right-0 top-6 bg-white rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.10)] p-3 z-10 min-w-[200px]" data-category-info>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <div
                            key={category.id}
                            className="flex items-center gap-2 text-[12px] text-[#131917]"
                          >
                            {IconComponent ? (
                              <IconComponent size={16} weight="bold" />
                            ) : (
                              <span>{category.emoji}</span>
                            )}
                            <span>{category.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-hide -mx-[25px] pl-[25px]">
              <div className="flex gap-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex-shrink-0 w-9 h-9 rounded-[10px] transition-all flex items-center justify-center ${
                        selectedCategory === category.id
                          ? 'bg-[#CEFB48] text-[#131917]'
                          : 'bg-white text-[#131917] hover:opacity-90'
                      }`}
                      title={category.name}
                    >
                      {IconComponent ? (
                        <IconComponent size={18} weight="bold" />
                      ) : (
                        <span>{category.emoji}</span>
                      )}
                    </button>
                  );
                })}
                <div className="flex-shrink-0 w-[25px]"></div>
              </div>
            </div>
          </div>
        )}


        {/* Botón Alimento Personalizado */}
        {!selectedFood && !showExerciseForm && (
          <div className="mb-4">
            <button
              onClick={() => {/* TODO: Modal para crear personalizado */}}
              className="w-full bg-[#CEFB48] text-[#131917] rounded-[10px] px-4 py-[10px] flex items-center justify-center gap-2 font-semibold text-[14px] hover:opacity-90 transition-opacity"
            >
              <span>Alimento personalizado</span>
              <Plus size={18} weight="bold" />
            </button>
          </div>
        )}

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-12">
            <p className="text-[#5A5B5A]">Buscando...</p>
          </div>
        )}

        {!isSearching && searchQuery.length > 2 && searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5A5B5A]">No se encontraron alimentos</p>
            <p className="text-[12px] text-[#5A5B5A] mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}

        {/* Mostrar formulario de ejercicio */}
        {showExerciseForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#131917] text-[20px] font-semibold">Registrar Ejercicio</h3>
              <button
                onClick={() => setShowExerciseForm(false)}
                className="text-[#5A5B5A] hover:text-[#131917] font-medium text-[14px]"
              >
                Volver
              </button>
            </div>
            <ExerciseForm
              onSuccess={() => {
                setShowExerciseForm(false);
                router.push('/dashboard');
              }}
              onCancel={() => setShowExerciseForm(false)}
            />
          </div>
        ) : selectedFood ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#131917] text-[24px] font-bold">{selectedFood.name}</h3>
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  // TODO: Implementar funcionalidad de favoritos
                }}
                className={`rounded-[15px] px-4 py-[5px] font-semibold text-[16px] hover:opacity-90 transition-opacity flex items-center gap-2 border-[3px] ${
                  isFavorite
                    ? 'bg-[#E5C438] border-[#E5C438] text-[#131917]'
                    : 'bg-transparent border-[#E5C438] text-[#131917]'
                }`}
              >
                <Star size={18} weight="bold" />
                <span>Favorito</span>
              </button>
            </div>
            <FoodLogForm
              food={selectedFood}
              onSuccess={() => {
                setSelectedFood(null);
                router.push('/dashboard');
              }}
              onCancel={() => setSelectedFood(null)}
            />
          </div>
        ) : (
          // Mostrar lista de resultados
          searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[#131917] text-[14px] font-medium mb-2">
                {searchQuery ? 'Resultados de búsqueda:' : 'Todos los alimentos:'}
              </h3>
              {searchResults.slice(0, visibleCount).map((food, index) => {
                const isFavorite = index === 0 || (food as any)?.favorite === true || selectedCategory === 'favoritos';
                return (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`relative w-full bg-[#131917] rounded-[30px] px-[20px] py-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.10)] hover:opacity-90 transition-all text-left ${isFavorite ? 'border-[5px] border-[#E5C438]' : ''}`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Fila 1: Nombre izquierda / Kcal derecha */}
                    <div className="flex items-end justify-between">
                      <p className="font-semibold text-white text-[20px] leading-none">{food.name}</p>
                      <div className="flex items-baseline gap-2 ml-4">
                        <span className="text-white font-semibold text-[32px] leading-none">{food.calories}</span>
                        <span className="text-white/70 text-[16px] leading-none">kcal</span>
                      </div>
                    </div>

                    {/* Fila 2: Macros izquierda / 100g derecha */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[14px]">
                        <div className="flex items-center gap-1 text-[#CEF154]">
                          <Fish size={18} weight="bold" />
                          <span>{food.protein}g</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#E5C438]">
                          <Bread size={18} weight="bold" />
                          <span>{food.carbs}g</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#DC3714]">
                          <Avocado size={18} weight="bold" />
                          <span>{food.fat}g</span>
                        </div>
                      </div>
                      <span className="text-white/70 text-[14px] ml-2">100g</span>
                    </div>
                  </div>
                  {isFavorite && (
                    <div className="absolute top-2 right-2 text-[#E5C438] opacity-[0.15]">
                      <Star size={60} weight="bold" />
                    </div>
                  )}
                </button>
              )})}
              {/* Sentinel para cargar más */}
              <div ref={loadMoreRef} />
            </div>
          )
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
