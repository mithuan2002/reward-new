import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

export async function runMigrations() {
  try {
    if (!db) {
      throw new Error("Database connection required for migrations");
    }
    
    console.log("Starting database migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}