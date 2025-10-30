'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, ChefHat } from 'lucide-react';
import Link from 'next/link';

interface Recipe {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
}

const sampleRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Ensalada de Quinoa',
    description: 'Ensalada nutritiva con quinoa, vegetales y aderezo',
    calories: 420,
    protein: 18,
    carbs: 45,
    fat: 12,
    servings: 2,
    ingredients: ['Quinoa cocida (200g)', 'Tomate (100g)', 'Pepino (100g)', 'Palta (50g)', 'Aceite de oliva (10ml)'],
    instructions: ['Cocinar la quinoa', 'Picar vegetales', 'Mezclar ingredientes', 'Agregar aderezo']
  },
  {
    id: 2,
    name: 'Pollo con Arroz',
    description: 'Pechuga de pollo con arroz integral y vegetales',
    calories: 580,
    protein: 48,
    carbs: 55,
    fat: 15,
    servings: 1,
    ingredients: ['Pechuga de pollo (150g)', 'Arroz integral (150g)', 'Brócoli (100g)', 'Zanahoria (50g)'],
    instructions: ['Cocinar pollo a la plancha', 'Cocinar arroz', 'Saltear vegetales', 'Servir junto']
  },
];

export default function RecipesPage() {
  const router = useRouter();
  const [recipes] = useState<Recipe[]>(sampleRecipes);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recetas</h1>
            <p className="text-gray-600 text-sm">Descubre recetas nutritivas</p>
          </div>
        </div>

        <div className="mb-4">
          <Button fullWidth onClick={() => {/* TODO: Modal crear receta */}}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Receta Personalizada
          </Button>
        </div>

        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} padding="md" className="hover:shadow-lg transition-all">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#5FB75D] flex items-center justify-center text-white text-xl">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                  
                  <div className="flex gap-3 text-xs mb-2">
                    <span className="text-red-600">P: {recipe.protein}g</span>
                    <span className="text-yellow-600">C: {recipe.carbs}g</span>
                    <span className="text-blue-600">G: {recipe.fat}g</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {recipe.servings} porción{recipe.servings > 1 ? 'es' : ''} • {recipe.calories} kcal
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Ingredientes:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {recipe.ingredients.slice(0, 3).map((ing, i) => (
                    <li key={i}>• {ing}</li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li className="text-[#5FB75D] font-medium">+{recipe.ingredients.length - 3} más</li>
                  )}
                </ul>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => {/* TODO: Ver detalle receta */}}
                >
                  Ver Detalles
                </Button>
                <Button
                  size="sm"
                  fullWidth
                  onClick={() => {/* TODO: Agregar a mi plan */}}
                >
                  Agregar a Plan
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Crea tus propias recetas y agrégales al plan de comidas semanal.
          </p>
        </div>
      </div>
    </div>
  );
}


