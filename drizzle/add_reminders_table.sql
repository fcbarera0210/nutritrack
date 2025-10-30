-- Agregar tabla meal_reminders para recordatorios de comidas

CREATE TABLE IF NOT EXISTS "meal_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"meal_type" text NOT NULL,
	"hour" integer NOT NULL,
	"minute" integer NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Crear índice para user_id
CREATE INDEX IF NOT EXISTS "meal_reminders_user_id_idx" ON "meal_reminders"("user_id");

-- Foreign key
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'meal_reminders_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "meal_reminders" ADD CONSTRAINT "meal_reminders_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

