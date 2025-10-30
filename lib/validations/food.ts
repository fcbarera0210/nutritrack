import { z } from 'zod';

export const foodSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  brand: z.string().optional(),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  servingSize: z.number().min(0),
  servingUnit: z.string().min(1),
  barcode: z.string().optional(),
});

export const foodLogSchema = z.object({
  foodId: z.number(),
  quantity: z.number().min(0.1),
  servingSize: z.number().min(0),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.string(),
});

export const exerciseSchema = z.object({
  name: z.string().min(1),
  durationMinutes: z.number().min(1),
  caloriesBurned: z.number().min(0),
  date: z.string(),
});

