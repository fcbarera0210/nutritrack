// Análisis nutricional avanzado

export interface NutritionalAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium?: number;
  sugar?: number;
  // Micronutrientes
  calcium?: number;
  iron?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminA?: number;
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

export interface AnalysisResult {
  percentageMet: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  status: {
    calories: 'under' | 'met' | 'over';
    protein: 'under' | 'met' | 'over';
    carbs: 'under' | 'met' | 'over';
    fat: 'under' | 'met' | 'over';
    fiber: 'under' | 'met' | 'over';
  };
  recommendations: string[];
  balance: 'balanced' | 'high-protein' | 'high-carb' | 'high-fat' | 'low-fiber';
}

export function analyzeNutrition(
  consumed: NutritionalAnalysis,
  targets: DailyTargets
): AnalysisResult {
  const percentageMet = {
    calories: Math.round((consumed.calories / targets.calories) * 100),
    protein: Math.round((consumed.protein / targets.protein) * 100),
    carbs: Math.round((consumed.carbs / targets.carbs) * 100),
    fat: Math.round((consumed.fat / targets.fat) * 100),
    fiber: consumed.fiber ? Math.round((consumed.fiber / targets.fiber) * 100) : 0,
  };

  const getStatus = (percentage: number): 'under' | 'met' | 'over' => {
    if (percentage < 80) return 'under';
    if (percentage > 120) return 'over';
    return 'met';
  };

  const status = {
    calories: getStatus(percentageMet.calories),
    protein: getStatus(percentageMet.protein),
    carbs: getStatus(percentageMet.carbs),
    fat: getStatus(percentageMet.fat),
    fiber: getStatus(percentageMet.fiber),
  };

  // Determinar balance
  const proteinRatio = consumed.protein / targets.protein;
  const carbsRatio = consumed.carbs / targets.carbs;
  const fatRatio = consumed.fat / targets.fat;

  let balance: 'balanced' | 'high-protein' | 'high-carb' | 'high-fat' | 'low-fiber' = 'balanced';
  
  if (proteinRatio > 1.2 && carbsRatio < 0.8 && fatRatio < 0.8) {
    balance = 'high-protein';
  } else if (carbsRatio > 1.2 && proteinRatio < 0.8 && fatRatio < 0.8) {
    balance = 'high-carb';
  } else if (fatRatio > 1.2 && proteinRatio < 0.8 && carbsRatio < 0.8) {
    balance = 'high-fat';
  } else if (percentageMet.fiber < 50) {
    balance = 'low-fiber';
  }

  // Generar recomendaciones
  const recommendations: string[] = [];

  if (status.protein === 'under') {
    recommendations.push('Considera aumentar alimentos ricos en proteína (pollo, pescado, huevos)');
  }
  if (status.carbs === 'under') {
    recommendations.push('Agrega más carbohidratos complejos a tu dieta');
  }
  if (status.fat === 'over') {
    recommendations.push('Reduce alimentos altos en grasas saturadas');
  }
  if (status.fiber === 'under' || balance === 'low-fiber') {
    recommendations.push('Consume más frutas, verduras y granos integrales para aumentar la fibra');
  }
  if (status.calories === 'over') {
    recommendations.push('Estás consumiendo más calorías de lo recomendado. Considera hacer más ejercicio o ajustar tu dieta');
  }
  if (balance === 'high-protein') {
    recommendations.push('Tu dieta es muy alta en proteína. Asegúrate de tener un balance adecuado');
  }

  if (recommendations.length === 0) {
    recommendations.push('¡Excelente! Tu dieta está bien balanceada');
  }

  return {
    percentageMet,
    status,
    recommendations,
    balance,
  };
}

export function getBalanceColor(balance: string): string {
  switch (balance) {
    case 'balanced':
      return 'text-green-600';
    case 'high-protein':
      return 'text-blue-600';
    case 'high-carb':
      return 'text-yellow-600';
    case 'high-fat':
      return 'text-orange-600';
    case 'low-fiber':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'under':
      return 'text-orange-600';
    case 'met':
      return 'text-green-600';
    case 'over':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

