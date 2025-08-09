import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Check if we have the DATABASE_URL available
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ DATABASE_URL environment variable is not set!");
  console.log("Using fallback in-memory storage for deployment...");
  
  // For Vercel deployment without database, we'll use a mock database
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.log("Running in serverless environment, using mock database");
  } else {
    console.error("📋 For Replit deployment:");
    console.error("1. Ensure PostgreSQL database is provisioned");
    console.error("2. Check environment variables are set correctly");
  }
}

// Only create database connection if DATABASE_URL is available
let pool: Pool | null = null;
let db: any = null;

if (databaseUrl) {
  // Check if it's a problematic Neon database and work around it
  if (databaseUrl.includes('neon.tech') && databaseUrl.includes('ep-jolly-bonus')) {
    console.warn("⚠️ Detected outdated Neon database URL. Using in-memory storage instead.");
    console.log("Using fallback configuration for development...");
  } else {
    console.log("Connecting to database...");
    pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    db = drizzle(pool, { schema });
  }
}

export { pool, db };