import { z } from 'zod';

export const foodSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  brand: z.string().nullable().optional(),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional().nullable(),
  sodium: z.number().min(0).optional().nullable(),
  sugar: z.number().min(0).optional().nullable(),
  servingSize: z.number().min(0.1),
  servingUnit: z.string().min(1),
  barcode: z.string().nullable().optional(),
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
  icon: z.string().optional(),
  date: z.string(),
});

