import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

function getDbUrl() {
  // Try different possible env var names
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }
  return url;
}

const sql = neon(getDbUrl());
export const db = drizzle(sql, { schema });
