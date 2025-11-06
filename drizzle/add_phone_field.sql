-- Agregar columna phone a user_profiles
ALTER TABLE "user_profiles" ADD COLUMN IF NOT EXISTS "phone" text;
