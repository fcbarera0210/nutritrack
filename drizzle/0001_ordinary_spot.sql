CREATE TABLE "meal_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"meal_type" text NOT NULL,
	"hour" integer NOT NULL,
	"minute" integer NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "manual_targets" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "target_weight" real;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "preferred_sports" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "dietary_preferences" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "food_allergies" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "meal_reminders" ADD CONSTRAINT "meal_reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;