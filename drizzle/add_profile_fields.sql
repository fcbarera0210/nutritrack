-- Migración para agregar campos adicionales a user_profiles
-- Solo agrega las columnas nuevas sin recrear tablas existentes

-- Agregar columna manual_targets
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "manual_targets" boolean DEFAULT false;

-- Agregar columna target_weight
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "target_weight" real;

-- Agregar columna preferred_sports
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "preferred_sports" text;

-- Agregar columna dietary_preferences
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "dietary_preferences" text;

-- Agregar columna food_allergies
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "food_allergies" text;

-- Agregar columna bio
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "bio" text;

