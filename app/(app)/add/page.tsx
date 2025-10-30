'use client';

import { useState, useEffect } from 'react';
import { Search, PlusCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FloatingFood } from '@/components/ui/FloatingFood';
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

  useEffect(() => {
    // Cargar todos los alimentos al inicio
    handleSearch('');
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    try {
      const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Filtrar por categoría si no es "todos"
      if (selectedCategory === 'todos') {
        setSearchResults(data);
      } else {
        const filtered = data.filter((food: FoodItem) => {
          const categoryId = categorizeFood(food.name);
          return categoryId === selectedCategory;
        });
        setSearchResults(filtered);
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
    handleSearch(searchQuery);
  };

  useEffect(() => {
    if (selectedCategory !== 'todos') {
      handleSearch(searchQuery);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating decorations */}
      <FloatingFood emoji="🍎" className="absolute top-20 left-8" delay={0} />
      <FloatingFood emoji="🍌" className="absolute top-40 right-8" delay={500} />
      <FloatingFood emoji="🥗" className="absolute top-60 left-12" delay={1000} />

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agregar Alimento</h1>
            <p className="text-gray-600 text-sm">
              Busca o crea un alimento para registrar tu consumo
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Buscar alimentos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Category Filters */}
        {!selectedFood && !showExerciseForm && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Filtrar por categoría:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-[#5FB75D] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!selectedFood && !showExerciseForm && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card padding="md" className="text-center cursor-pointer hover:shadow-xl transition-all" onClick={() => {/* TODO: Modal para crear personalizado */}}>
              <PlusCircle className="w-8 h-8 text-[#5FB75D] mx-auto mb-2" />
              <p className="font-semibold text-gray-900">Crear Personalizado</p>
              <p className="text-xs text-gray-500">Agregar manualmente</p>
            </Card>
            <Card padding="md" className="text-center cursor-pointer hover:shadow-xl transition-all" onClick={() => setShowExerciseForm(true)}>
              <span className="text-4xl">🏃</span>
              <p className="font-semibold text-gray-900 mt-2">Agregar Ejercicio</p>
              <p className="text-xs text-gray-500">Registrar actividad</p>
            </Card>
          </div>
        )}

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-12">
            <p className="text-gray-500">Buscando...</p>
          </div>
        )}

        {!isSearching && searchQuery.length > 2 && searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron alimentos</p>
            <p className="text-sm text-gray-400 mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}

        {/* Mostrar formulario de ejercicio */}
        {showExerciseForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Registrar Ejercicio</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowExerciseForm(false)}>
                Volver
              </Button>
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
              <h3 className="text-lg font-semibold">Registrar Alimento</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFood(null)}>
                Ver más alimentos
              </Button>
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {searchQuery ? 'Resultados de búsqueda:' : 'Todos los alimentos:'}
              </h3>
              {searchResults.map((food) => (
                <Card 
                  key={food.id} 
                  padding="md" 
                  className="hover:shadow-xl transition-all cursor-pointer border hover:border-[#5FB75D]"
                  onClick={() => setSelectedFood(food)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {food.brand && <span>{food.brand}</span>}
                        <span>100g</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-red-600">P: {food.protein}g</span>
                        <span className="text-yellow-600">C: {food.carbs}g</span>
                        <span className="text-blue-600">G: {food.fat}g</span>
                      </div>
                    </div>
                    <span className="text-[#5FB75D] font-bold text-lg ml-4">{food.calories} kcal</span>
                  </div>
                </Card>
              ))}
            </div>
          )
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

