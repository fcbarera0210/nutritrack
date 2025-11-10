-- Crear tabla exercise_types para el catálogo de ejercicios
CREATE TABLE IF NOT EXISTS "exercise_types" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL UNIQUE,
  "met" real NOT NULL,
  "icon" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

