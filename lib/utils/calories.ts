// Cálculo de calorías basado en Mifflin-St Jeor Equation
export function calculateTDEE(weight: number, height: number, age: number, gender: 'male' | 'female', activityLevel: string): number {
  // BMR Calculation (Basal Metabolic Rate)
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };

  const activityMultiplier = multipliers[activityLevel] || 1.2;
  
  return Math.round(bmr * activityMultiplier);
}

// Calculate macros from TDEE and goal
export function calculateMacros(tdee: number, goal: 'weight_loss' | 'maintenance' | 'muscle_gain'): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const adjustments: Record<string, { calorieChange: number; proteinPercentage: number; carbsPercentage: number; fatPercentage: number }> = {
    weight_loss: { calorieChange: -500, proteinPercentage: 30, carbsPercentage: 35, fatPercentage: 35 },
    maintenance: { calorieChange: 0, proteinPercentage: 25, carbsPercentage: 40, fatPercentage: 35 },
    muscle_gain: { calorieChange: 300, proteinPercentage: 30, carbsPercentage: 45, fatPercentage: 25 },
  };

  const adjustment = adjustments[goal] || adjustments.maintenance;
  const targetCalories = tdee + adjustment.calorieChange;

  // Calculate macros in grams
  const protein = Math.round((targetCalories * adjustment.proteinPercentage / 100) / 4);
  const carbs = Math.round((targetCalories * adjustment.carbsPercentage / 100) / 4);
  const fat = Math.round((targetCalories * adjustment.fatPercentage / 100) / 9);

  return {
    calories: targetCalories,
    protein,
    carbs,
    fat,
  };
}

