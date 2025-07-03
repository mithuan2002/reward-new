import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db } from "./db";

export async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}