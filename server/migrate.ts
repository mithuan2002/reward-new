
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pool } from "./db";

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
  } finally {
    // Don't close pool since it might be used elsewhere
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log("Migration process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration process failed:", error);
      process.exit(1);
    });
}
