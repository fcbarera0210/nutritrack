-- Migración para agregar tabla de logs de búsquedas de IA
-- Permite rastrear las búsquedas diarias por usuario para controlar límites

CREATE TABLE IF NOT EXISTS "ai_search_logs" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "food_name" text NOT NULL,
  "date" date NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Índice para búsquedas rápidas por usuario y fecha
CREATE INDEX IF NOT EXISTS "ai_search_logs_user_date_idx" ON "ai_search_logs"("user_id", "date");

