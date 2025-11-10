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
  NotePencil,
  CookingPot,
  Shrimp,
  Jar,
  Acorn,
  BeerBottle,
  BatteryVerticalEmpty
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
    id: 'cereales',
    name: 'Cereales',
    emoji: '🌾',
    icon: Bread,
    keywords: ['arroz', 'pasta', 'avena', 'quinoa', 'pan', 'garbanzo', 'lenteja', 'frijol', 'frijoles']
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
  },
  {
    id: 'platos',
    name: 'Platos Preparados',
    emoji: '🍲',
    icon: CookingPot,
    keywords: ['plato', 'preparado', 'empanada', 'pastel', 'cazuela', 'completo', 'chorrillana']
  },
  {
    id: 'congelados',
    name: 'Congelados',
    emoji: '🧊',
    icon: Shrimp,
    keywords: ['congelado', 'frozen']
  },
  {
    id: 'conservas',
    name: 'Conservas',
    emoji: '🥫',
    icon: Jar,
    keywords: ['conserva', 'enlatado', 'suplemento']
  },
  {
    id: 'frutos_secos',
    name: 'Frutos Secos',
    emoji: '🥜',
    icon: Acorn,
    keywords: ['fruto seco', 'mani', 'nuez', 'almendra', 'semilla', 'chia', 'linaza']
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    emoji: '🥤',
    icon: BeerBottle,
    keywords: ['bebida', 'jugo', 'agua', 'cerveza', 'vino', 'cafe', 'te']
  },
  {
    id: 'aderezos',
    name: 'Aderezos',
    emoji: '🍯',
    icon: BatteryVerticalEmpty,
    keywords: ['salsa', 'aderezo', 'mayonesa', 'ketchup', 'mostaza', 'aliño', 'pebre']
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

// Mapeo de categorías del JSON a IDs del sistema
// Según instrucciones:
// 1. Platos Preparados → platos
// 2. Vegetales → verduras
// 3. Lácteos y Huevos → lacteos
// 4, 12, 15. Carbohidratos y Legumbres, Panes y Galletas, Cereales y Desayuno → cereales
// 5. Snacks y Dulces → dulces
// 6. Frutas → frutas
// 7, 11, 14. Proteínas, Pescados y Mariscos, Embutidos y Cecinas → carnes
// 8. Congelados → congelados
// 9. Bebidas → bebidas
// 10, 17. Aliños, Salsas y Aderezos → aderezos
// 13, 16. Conservas, Suplementos → conservas
// 18, 20. Frutos Secos, Semillas → frutos_secos
// 19. Aceites y Grasas → grasas
export const categoryMapping: Record<string, string> = {
  'Platos Preparados': 'platos',           // 1
  'Vegetales': 'verduras',                  // 2
  'Lácteos y Huevos': 'lacteos',           // 3
  'Carbohidratos y Legumbres': 'cereales', // 4
  'Snacks y Dulces': 'dulces',              // 5
  'Frutas': 'frutas',                       // 6
  'Proteínas': 'carnes',                    // 7
  'Congelados': 'congelados',               // 8
  'Bebidas': 'bebidas',                     // 9
  'Aliños': 'aderezos',                     // 10
  'Pescados y Mariscos': 'carnes',          // 11
  'Panes y Galletas': 'cereales',           // 12
  'Conservas': 'conservas',                 // 13
  'Embutidos y Cecinas': 'carnes',          // 14
  'Cereales y Desayuno': 'cereales',        // 15
  'Suplementos': 'conservas',               // 16
  'Salsas y Aderezos': 'aderezos',          // 17
  'Frutos Secos': 'frutos_secos',           // 18
  'Aceites y Grasas': 'grasas',             // 19
  'Semillas': 'frutos_secos'                 // 20
};

// Función para obtener el ID de categoría desde el campo categoria de la BD
export function getCategoryIdFromDbCategory(dbCategory: string | null | undefined): string {
  if (!dbCategory) return 'otros';
  
  // Mapear desde el nombre de categoría del JSON
  return categoryMapping[dbCategory] || 'otros';
}

