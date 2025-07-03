import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("📋 For Render deployment:");
  console.error("1. Create a PostgreSQL database first");
  console.error("2. Copy the External Database URL");
  console.error("3. Add it as DATABASE_URL environment variable in your web service");
  console.error("4. Make sure there are no extra spaces in the URL");
  throw new Error(
    "DATABASE_URL must be set. Please check the DEPLOYMENT.md file for setup instructions.",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });