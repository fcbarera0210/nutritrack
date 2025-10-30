import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local FIRST
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const result = config({ path: envPath });
  console.log('📄 Cargando .env.local desde:', envPath);
  
  // Debug: mostrar las variables cargadas (sin mostrar el valor completo del secret)
  if (result.parsed) {
    console.log('✅ Variables cargadas:', Object.keys(result.parsed).join(', '));
  }
} else {
  console.warn('⚠️ .env.local no encontrado en:', envPath);
}

// Now import after env is loaded
import { db } from '../lib/db';
import { seedFoods } from '../lib/utils/seed';

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ No configurado');
  
  try {
    await seedFoods();
    console.log('✅ Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

main();

