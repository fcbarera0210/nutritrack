-- Crear tabla user_favorites para favoritos de alimentos

CREATE TABLE IF NOT EXISTS "user_favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"food_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS "user_favorites_user_id_idx" ON "user_favorites"("user_id");
CREATE INDEX IF NOT EXISTS "user_favorites_food_id_idx" ON "user_favorites"("food_id");

-- Foreign keys
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_food_id_foods_id_fk'
    ) THEN
        ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_food_id_foods_id_fk" 
        FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

-- Crear índice único para evitar duplicados
CREATE UNIQUE INDEX IF NOT EXISTS "user_favorites_user_food_unique" ON "user_favorites"("user_id", "food_id");

