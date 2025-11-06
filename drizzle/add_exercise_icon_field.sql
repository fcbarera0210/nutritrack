-- Agregar columna icon a exercises
ALTER TABLE "exercises" ADD COLUMN IF NOT EXISTS "icon" text;

