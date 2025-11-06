-- Crear tabla water_logs para registro de hidratación

CREATE TABLE IF NOT EXISTS "water_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" real NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS "water_logs_user_id_idx" ON "water_logs"("user_id");
CREATE INDEX IF NOT EXISTS "water_logs_date_idx" ON "water_logs"("date");

-- Foreign key
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'water_logs_user_id_users_id_fk'
    ) THEN
        ALTER TABLE "water_logs" ADD CONSTRAINT "water_logs_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

