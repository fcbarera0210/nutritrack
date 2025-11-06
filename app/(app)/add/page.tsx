'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, Plus, ArrowLeft, Info, Fish, Grains, Avocado, Star, NotePencil } from '@phosphor-icons/react';
import { FoodLogForm } from '@/components/forms/FoodLogForm';
import { CustomFoodForm } from '@/components/forms/CustomFoodForm';
import { Modal } from '@/components/ui/Modal';
import { FoodListSkeleton } from '@/components/ui/Skeleton';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [hasCustomFoods, setHasCustomFoods] = useState(false);

  useEffect(() => {
    // Cargar todos los alimentos al inicio
    handleSearch('');
    // Cargar favoritos del usuario
    fetchFavorites();
    // Verificar si tiene alimentos personalizados
    checkCustomFoods();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/foods/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavoriteIds(data.favoriteIds || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const checkCustomFoods = async () => {
    try {
      const response = await fetch('/api/foods/custom');
      if (response.ok) {
        const data = await response.json();
        setHasCustomFoods(data.hasCustomFoods || false);
      } else {
        // Si falla, establecer en false
        setHasCustomFoods(false);
      }
    } catch (error) {
      console.error('Error checking custom foods:', error);
      setHasCustomFoods(false);
    }
  };

  const toggleFavorite = async (foodId: number) => {
    const isCurrentlyFavorite = favoriteIds.includes(foodId);
    
    try {
      if (isCurrentlyFavorite) {
        // Eliminar de favoritos
        const response = await fetch(`/api/foods/favorites?foodId=${foodId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setFavoriteIds(prev => prev.filter(id => id !== foodId));
          if (selectedFood?.id === foodId) {
            setIsFavorite(false);
          }
        }
      } else {
        // Agregar a favoritos
        const response = await fetch('/api/foods/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foodId }),
        });
        if (response.ok) {
          setFavoriteIds(prev => [...prev, foodId]);
          if (selectedFood?.id === foodId) {
            setIsFavorite(true);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
      
      // Filtrar por categoría si no es "todos", "favoritos" o "personalizados"
      if (category === 'todos') {
        setSearchResults(data);
        setVisibleCount(15);
      } else if (category === 'favoritos') {
        // Filtrar solo favoritos usando los IDs ya cargados
        if (favoriteIds.length > 0) {
          // Obtener todos los alimentos y filtrar por favoritos
          const allFoodsResponse = await fetch(`/api/foods/search?q=`);
          if (allFoodsResponse.ok) {
            const allFoods = await allFoodsResponse.json();
            const favorites = allFoods.filter((food: FoodItem) => favoriteIds.includes(food.id));
            setSearchResults(favorites);
          } else {
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
        setVisibleCount(15);
      } else if (category === 'personalizados') {
        // Filtrar solo alimentos personalizados del usuario
        const customFoodsResponse = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}&customOnly=true`);
        if (customFoodsResponse.ok) {
          const customFoods = await customFoodsResponse.json();
          setSearchResults(customFoods);
        } else {
          setSearchResults([]);
        }
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
        {!selectedFood && (
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
        {!selectedFood && (
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
                      {/* Todos */}
                      {categories.find(cat => cat.id === 'todos') && (() => {
                        const category = categories.find(cat => cat.id === 'todos')!;
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
                      })()}
                      {/* Personalizados */}
                      {hasCustomFoods && (
                        <div className="flex items-center gap-2 text-[12px] text-[#131917]">
                          <NotePencil size={16} weight="bold" />
                          <span>Personalizados</span>
                        </div>
                      )}
                      {/* Favoritos - Solo visible si tiene favoritos */}
                      {favoriteIds.length > 0 && categories.find(cat => cat.id === 'favoritos') && (() => {
                        const category = categories.find(cat => cat.id === 'favoritos')!;
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
                      })()}
                      {/* Resto de categorías */}
                      {categories.filter(cat => cat.id !== 'todos' && cat.id !== 'favoritos').map((category) => {
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
            <div className="bg-[#D9D9D9] py-2 rounded-[15px] overflow-x-auto scrollbar-hide -mx-[25px] pl-[25px]">
              <div className="flex gap-2">
                {/* Primer filtro: Todos */}
                {categories.find(cat => cat.id === 'todos') && (() => {
                  const category = categories.find(cat => cat.id === 'todos')!;
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange('todos')}
                      className={`flex-shrink-0 w-9 h-9 rounded-[10px] transition-all flex items-center justify-center ${
                        selectedCategory === 'todos'
                          ? 'bg-[#CEFB48] text-[#131917]'
                          : 'bg-white text-[#131917] hover:opacity-90'
                      }`}
                      title="Todos"
                    >
                      {IconComponent ? (
                        <IconComponent size={18} weight="bold" />
                      ) : (
                        <span>{category.emoji}</span>
                      )}
                    </button>
                  );
                })()}
                {/* Segundo filtro: Personalizados - Solo visible si tiene alimentos personalizados */}
                {hasCustomFoods && (
                  <button
                    onClick={() => handleCategoryChange('personalizados')}
                    className={`flex-shrink-0 w-9 h-9 rounded-[10px] transition-all flex items-center justify-center ${
                      selectedCategory === 'personalizados'
                        ? 'bg-[#CEFB48] text-[#131917]'
                        : 'bg-white text-[#131917] hover:opacity-90'
                    }`}
                    title="Personalizados"
                  >
                    <NotePencil size={18} weight="bold" />
                  </button>
                )}
                {/* Tercer filtro: Favoritos - Solo visible si tiene favoritos */}
                {favoriteIds.length > 0 && categories.find(cat => cat.id === 'favoritos') && (() => {
                  const category = categories.find(cat => cat.id === 'favoritos')!;
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange('favoritos')}
                      className={`flex-shrink-0 w-9 h-9 rounded-[10px] transition-all flex items-center justify-center ${
                        selectedCategory === 'favoritos'
                          ? 'bg-[#CEFB48] text-[#131917]'
                          : 'bg-white text-[#131917] hover:opacity-90'
                      }`}
                      title="Favoritos"
                    >
                      {IconComponent ? (
                        <IconComponent size={18} weight="bold" />
                      ) : (
                        <span>{category.emoji}</span>
                      )}
                    </button>
                  );
                })()}
                {/* Resto de filtros */}
                {categories.filter(cat => cat.id !== 'todos' && cat.id !== 'favoritos').map((category) => {
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
        {!selectedFood && (
          <div className="mb-4">
            <button
              onClick={() => setShowCustomFoodModal(true)}
              className="w-full bg-[#CEFB48] text-[#131917] rounded-[10px] px-4 py-[10px] flex items-center justify-center gap-2 font-semibold text-[14px] hover:opacity-90 transition-opacity"
            >
              <span>Alimento personalizado</span>
              <Plus size={18} weight="bold" />
            </button>
          </div>
        )}

        {/* Search Results Skeleton */}
        {isSearching && !selectedFood && (
          <FoodListSkeleton />
        )}

        {/* No results message */}
        {!isSearching && searchQuery.length > 2 && searchResults.length === 0 && !selectedFood && (
          <div className="text-center py-12">
            <p className="text-[#5A5B5A]">No se encontraron alimentos</p>
            <p className="text-[12px] text-[#5A5B5A] mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}

        {selectedFood ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#131917] text-[24px] font-bold">{selectedFood.name}</h3>
              <button
                onClick={() => toggleFavorite(selectedFood.id)}
                className={`rounded-[15px] px-4 py-[5px] font-semibold text-[16px] hover:opacity-90 transition-opacity flex items-center gap-2 border-[3px] ${
                  isFavorite
                    ? 'bg-[#E5C438] border-[#E5C438] text-[#131917]'
                    : 'bg-transparent border-[#E5C438] text-[#131917]'
                }`}
              >
                <Star size={18} weight={isFavorite ? "fill" : "bold"} />
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
              {searchResults.slice(0, visibleCount).map((food) => {
                const isFoodFavorite = favoriteIds.includes(food.id);
                return (
                <button
                  key={food.id}
                  onClick={() => {
                    setSelectedFood(food);
                    setIsFavorite(isFoodFavorite);
                  }}
                  className={`relative w-full bg-[#131917] rounded-[30px] px-[20px] py-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.10)] hover:opacity-90 transition-all text-left ${isFoodFavorite ? 'border-[5px] border-[#E5C438]' : ''}`}
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

                    {/* Fila 2: 100g izquierda / Macros derecha */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-[14px]">100g</span>
                      <div className="flex items-center gap-4 text-[14px]">
                        <div className="flex items-center gap-1">
                          <Fish size={18} weight="bold" className="text-[#CEF154]" />
                          <span className="text-white">{food.protein}g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Grains size={18} weight="bold" className="text-[#E5C438]" />
                          <span className="text-white">{food.carbs}g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Avocado size={18} weight="bold" className="text-[#DC3714]" />
                          <span className="text-white">{food.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isFoodFavorite && (
                    <div className="absolute top-2 left-2 text-[#E5C438] opacity-[0.15]">
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

      {/* Custom Food Modal */}
      <Modal
        isOpen={showCustomFoodModal}
        onClose={() => setShowCustomFoodModal(false)}
        title="Crear Alimento Personalizado"
      >
        <CustomFoodForm
          onSuccess={async (food) => {
            setShowCustomFoodModal(false);
            setSelectedFood(food);
            setIsFavorite(false);
            // Actualizar el estado de alimentos personalizados después de un pequeño delay
            // para asegurar que la base de datos se haya actualizado
            setTimeout(() => {
              checkCustomFoods();
            }, 500);
          }}
          onCancel={() => setShowCustomFoodModal(false)}
        />
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
