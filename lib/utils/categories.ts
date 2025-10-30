// Sistema de categorías basado en palabras clave
export interface Category {
  id: string;
  name: string;
  emoji: string;
  keywords: string[];
}

export const categories: Category[] = [
  {
    id: 'carnes',
    name: 'Carnes y Pescados',
    emoji: '🥩',
    keywords: ['pollo', 'carne', 'salmon', 'pescado', 'atun', 'merluza', 'pechuga', 'filete', 'huevo']
  },
  {
    id: 'lacteos',
    name: 'Lácteos',
    emoji: '🥛',
    keywords: ['leche', 'queso', 'yogurt', 'mantequilla', 'queso crema', 'queso cheddar', 'crema']
  },
  {
    id: 'frutas',
    name: 'Frutas',
    emoji: '🍎',
    keywords: ['manzana', 'platano', 'banana', 'naranja', 'fresas', 'kiwi', 'mango', 'pera', 'piña', 'sandia', 'uvas', 'palta']
  },
  {
    id: 'verduras',
    name: 'Verduras',
    emoji: '🥗',
    keywords: ['tomate', 'lechuga', 'brocoli', 'espinaca', 'zanahoria', 'cebolla', 'pimiento', 'aji', 'zapallo', 'champinones', 'papas', 'camote']
  },
  {
    id: 'legumbres',
    name: 'Legumbres',
    emoji: '🌱',
    keywords: ['garbanzo', 'lenteja', 'frijol', 'frijoles', 'tofu']
  },
  {
    id: 'cereales',
    name: 'Cereales',
    emoji: '🌾',
    keywords: ['arroz', 'pasta', 'avena', 'quinoa', 'pan']
  },
  {
    id: 'grasas',
    name: 'Aceites y Grasas',
    emoji: '🫒',
    keywords: ['aceite', 'mantequilla', 'mani', 'nuez']
  },
  {
    id: 'dulces',
    name: 'Dulces',
    emoji: '🍫',
    keywords: ['chocolate', 'azucar', 'miel', 'mermelada']
  },
  {
    id: 'todos',
    name: 'Todos',
    emoji: '📋',
    keywords: []
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

