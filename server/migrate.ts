import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

export async function runMigrations() {
  try {
    // Skip migrations in serverless environments if already run
    if (process.env.VERCEL) {
      console.log("Serverless environment detected, skipping automatic migrations");
      return;
    }
    
    console.log("Starting database migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    // Don't throw error in production to avoid blocking startup
    if (process.env.NODE_ENV === 'production') {
      console.error("Continuing without migrations in production...");
      return;
    }
    throw error;
  }
}