import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export const profileSchema = z.object({
  weight: z.number().min(0).max(500).nullable().optional(),
  height: z.number().min(0).max(300).nullable().optional(),
  age: z.number().min(1).max(120).nullable().optional(),
  gender: z.enum(['male', 'female', 'other']).nullable().optional(),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']).nullable().optional(),
  goal: z.enum(['weight_loss', 'maintenance', 'muscle_gain']).nullable().optional(),
  targetCalories: z.number().nullable().optional(),
  targetProtein: z.number().nullable().optional(),
  targetCarbs: z.number().nullable().optional(),
  targetFat: z.number().nullable().optional(),
});

