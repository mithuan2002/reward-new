import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Check if we have the DATABASE_URL available
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("📋 To fix this:");
  console.error("1. Open a new tab and type 'Database'");
  console.error("2. Click 'create a database' in the Database panel");
  console.error("3. Restart your application");
  throw new Error("DATABASE_URL is required");
}

console.log("✅ Connecting to PostgreSQL database...");
const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: false // Replit PostgreSQL doesn't require SSL
});

const db = drizzle(pool, { schema });

export { pool, db };