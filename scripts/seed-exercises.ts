// Load environment variables FIRST before any other imports
import 'dotenv/config';
import * as path from 'path';
import * as fs from 'fs';

// Try to load .env.local first, then .env as fallback
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
  console.log('📄 Cargando .env.local');
} else if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('📄 Cargando .env');
} else {
  console.warn('⚠️ No se encontró archivo .env.local ni .env');
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ No configurado');

// Now import after env is loaded
import { db } from '../lib/db';
import { exerciseTypes } from '../lib/db/schema';
import newExercisesData from './new-exercises.json';

interface NewExercise {
  actividad: string;
  valor_met: number;
}

// Mapeo de nombres de ejercicios a iconos por defecto
const exerciseIconMapping: Record<string, string> = {
  'Baloncesto': 'Basketball',
  'Bádminton': 'TennisBall',
  'Baile': 'SneakerMove',
  'Bicicleta estática': 'PersonSimpleBike',
  'Elíptica': 'PersonSimpleBike',
  'Boxeo': 'BoxingGlove',
  'Calistenia': 'Barbell',
  'Caminata rápida': 'PersonSimpleWalk',
  'Ciclismo': 'PersonSimpleBike',
  'Correr': 'PersonSimpleRun',
  'CrossFit': 'Pulse',
  'Escalar escaleras': 'PersonSimpleHike',
  'Fútbol': 'SoccerBall',
  'Golf': 'PersonSimpleHike',
  'Judo': 'BoxingGlove',
  'Karate': 'BoxingGlove',
  'Taekwondo': 'BoxingGlove',
  'Kayak': 'PersonSimpleSwim',
  'Levantamiento de pesas': 'Barbell',
  'Natación': 'PersonSimpleSwim',
  'Pádel': 'TennisBall',
  'Patinaje': 'PersonSimpleBike',
  'Pilates': 'PersonSimpleTaiChi',
  'Remo': 'PersonSimpleSwim',
  'Senderismo': 'PersonSimpleHike',
  'Squash': 'TennisBall',
  'Tenis': 'TennisBall',
  'Trotar': 'PersonSimpleRun',
  'Voleibol': 'Volleyball',
  'Yoga': 'PersonSimpleTaiChi',
};

function getDefaultIcon(exerciseName: string): string {
  // Buscar el icono por palabras clave en el nombre
  for (const [keyword, icon] of Object.entries(exerciseIconMapping)) {
    if (exerciseName.includes(keyword)) {
      return icon;
    }
  }
  // Icono por defecto
  return 'Barbell';
}

async function seedExercises() {
  try {
    console.log('🔄 Iniciando inserción de ejercicios...');
    
    // Verificar si ya existen ejercicios
    const existing = await db.select().from(exerciseTypes).limit(1);
    
    if (existing.length > 0) {
      console.log('⚠️  Ya existen ejercicios en la base de datos.');
      console.log('   Si quieres reemplazarlos, primero ejecuta: DELETE FROM exercise_types;');
      process.exit(0);
    }
    
    // Preparar los ejercicios para insertar
    const exercisesToInsert = (newExercisesData as NewExercise[]).map((exercise) => {
      return {
        name: exercise.actividad,
        met: exercise.valor_met,
        icon: getDefaultIcon(exercise.actividad),
      };
    });
    
    // Insertar en lotes
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < exercisesToInsert.length; i += batchSize) {
      const batch = exercisesToInsert.slice(i, i + batchSize);
      await db.insert(exerciseTypes).values(batch);
      inserted += batch.length;
      console.log(`  ✅ Insertados ${inserted}/${exercisesToInsert.length} ejercicios...`);
    }
    
    console.log(`\n✅ ¡Proceso completado!`);
    console.log(`   - Ejercicios insertados: ${exercisesToInsert.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar ejercicios:', error);
    process.exit(1);
  }
}

seedExercises();

