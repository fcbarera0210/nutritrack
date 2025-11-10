import { pgTable, serial, text, integer, real, boolean, timestamp, date } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User profiles with fitness goals
export const userProfiles = pgTable('user_profiles', {
  userId: integer('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  weight: real('weight'),
  height: real('height'),
  age: integer('age'),
  gender: text('gender'), // 'male', 'female', 'other'
  activityLevel: text('activity_level'), // 'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'
  goal: text('goal'), // 'weight_loss', 'maintenance', 'muscle_gain'
  targetCalories: real('target_calories'),
  targetProtein: real('target_protein'),
  targetCarbs: real('target_carbs'),
  targetFat: real('target_fat'),
  // Manual override flag
  manualTargets: boolean('manual_targets').default(false), // Si true, los objetivos son manuales y no se recalculan
  // Additional user information
  targetWeight: real('target_weight'), // Peso objetivo
  preferredSports: text('preferred_sports'), // JSON array de deportes preferidos
  dietaryPreferences: text('dietary_preferences'), // JSON array: 'vegetarian', 'vegan', 'gluten_free', 'keto', etc.
  foodAllergies: text('food_allergies'), // Texto libre de alergias alimentarias
  bio: text('bio'), // Descripción breve del usuario
  phone: text('phone'), // Teléfono del usuario
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Foods database
export const foods = pgTable('foods', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  calories: real('calories').notNull(),
  protein: real('protein').notNull(),
  carbs: real('carbs').notNull(),
  fat: real('fat').notNull(),
  fiber: real('fiber'),
  sodium: real('sodium'),
  sugar: real('sugar'),
  servingSize: real('serving_size').notNull(),
  servingUnit: text('serving_unit').notNull(), // 'g', 'ml', 'unit', etc.
  barcode: text('barcode'),
  source: text('source'), // 'openfoodfacts', 'custom', 'local'
  category: text('category'), // Categoría del alimento
  isCustom: boolean('is_custom').default(false),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Food logs - daily intake
export const foodLogs = pgTable('food_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  foodId: integer('food_id').notNull().references(() => foods.id, { onDelete: 'cascade' }),
  quantity: real('quantity').notNull(), // multiplier for serving size
  servingSize: real('serving_size').notNull(),
  date: date('date').notNull(),
  mealType: text('meal_type').notNull(), // 'breakfast', 'lunch', 'dinner', 'snack'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Exercise types - catálogo de ejercicios disponibles
export const exerciseTypes = pgTable('exercise_types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  met: real('met').notNull(), // Metabolic Equivalent of Task
  icon: text('icon'), // Nombre del icono de Phosphor Icons por defecto
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Exercise logs
export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  caloriesBurned: integer('calories_burned').notNull(),
  icon: text('icon'), // Nombre del icono de Phosphor Icons
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User streaks for gamification
export const userStreaks = pgTable('user_streaks', {
  userId: integer('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastLoggedDate: date('last_logged_date'),
  totalLogs: integer('total_logs').default(0).notNull(),
});

// User achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementType: text('achievement_type').notNull(), // 'first_meal', '7_day_streak', '100_foods', etc.
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
});

// Meal reminders configuration
export const mealReminders = pgTable('meal_reminders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mealType: text('meal_type').notNull(), // 'breakfast', 'lunch', 'dinner', 'snack'
  hour: integer('hour').notNull(), // 0-23
  minute: integer('minute').notNull(), // 0-59
  enabled: boolean('enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User food favorites
export const userFavorites = pgTable('user_favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  foodId: integer('food_id').notNull().references(() => foods.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Water logs - daily hydration
export const waterLogs = pgTable('water_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(), // Amount in ml
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI search logs - track daily AI searches per user
export const aiSearchLogs = pgTable('ai_search_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  foodName: text('food_name').notNull(),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

