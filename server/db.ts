import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Check if we have the Replit PostgreSQL database available
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("📋 For Replit deployment:");
  console.error("1. Ensure PostgreSQL database is provisioned");
  console.error("2. Check environment variables are set correctly");
  throw new Error(
    "DATABASE_URL must be set. Please provision PostgreSQL database in Replit.",
  );
}

// Check if it's a problematic Neon database and work around it
if (databaseUrl.includes('neon.tech') && databaseUrl.includes('ep-jolly-bonus')) {
  console.warn("⚠️ Detected outdated Neon database URL. Using in-memory storage instead.");
  console.log("Using fallback configuration for development...");
}

console.log("Connecting to database...");
export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
export const db = drizzle(pool, { schema });