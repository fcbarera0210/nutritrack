// Sistema de categorías basado en palabras clave
import { 
  Fish, 
  Cheese, 
  Cherries, 
  Carrot, 
  Plant, 
  Bread, 
  Avocado, 
  Cookie, 
  ClipboardText,
  Star,
  NotePencil
} from '@phosphor-icons/react';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  keywords: string[];
  icon?: any; // Phosphor Icon component
}

export const categories: Category[] = [
  {
    id: 'todos',
    name: 'Todos',
    emoji: '📋',
    icon: ClipboardText,
    keywords: []
  },
  {
    id: 'favoritos',
    name: 'Favoritos',
    emoji: '⭐',
    icon: Star,
    keywords: []
  },
  {
    id: 'carnes',
    name: 'Carnes y Pescados',
    emoji: '🥩',
    icon: Fish,
    keywords: ['pollo', 'carne', 'salmon', 'pescado', 'atun', 'merluza', 'pechuga', 'filete', 'huevo']
  },
  {
    id: 'lacteos',
    name: 'Lácteos',
    emoji: '🥛',
    icon: Cheese,
    keywords: ['leche', 'queso', 'yogurt', 'mantequilla', 'queso crema', 'queso cheddar', 'crema']
  },
  {
    id: 'frutas',
    name: 'Frutas',
    emoji: '🍎',
    icon: Cherries,
    keywords: ['manzana', 'platano', 'banana', 'naranja', 'fresas', 'kiwi', 'mango', 'pera', 'piña', 'sandia', 'uvas', 'palta']
  },
  {
    id: 'verduras',
    name: 'Verduras',
    emoji: '🥗',
    icon: Carrot,
    keywords: ['tomate', 'lechuga', 'brocoli', 'espinaca', 'zanahoria', 'cebolla', 'pimiento', 'aji', 'zapallo', 'champinones', 'papas', 'camote']
  },
  {
    id: 'legumbres',
    name: 'Legumbres',
    emoji: '🌱',
    icon: Plant,
    keywords: ['garbanzo', 'lenteja', 'frijol', 'frijoles', 'tofu']
  },
  {
    id: 'cereales',
    name: 'Cereales',
    emoji: '🌾',
    icon: Bread,
    keywords: ['arroz', 'pasta', 'avena', 'quinoa', 'pan']
  },
  {
    id: 'grasas',
    name: 'Aceites y Grasas',
    emoji: '🫒',
    icon: Avocado,
    keywords: ['aceite', 'mantequilla', 'mani', 'nuez']
  },
  {
    id: 'dulces',
    name: 'Dulces',
    emoji: '🍫',
    icon: Cookie,
    keywords: ['chocolate', 'azucar', 'miel', 'mermelada']
  }
];

export function categorizeFood(foodName: string): string {
  const normalizedName = foodName.toLowerCase();
  
  for (const category of categories) {
    if (category.id === 'todos') continue;
    
    if (category.keywords.some(keyword => normalizedName.includes(keyword))) {
      return category.id;
    }
  }
  
  return 'otros';
}

export function getCategoryByFoodName(name: string): Category {
  const categoryId = categorizeFood(name);
  return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1];
}

export function getAllCategories(): Category[] {
  return categories;
}

