
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';

// Create SQLite database file
const dbPath = path.join(process.cwd(), 'database.sqlite');
const sqlite = new Database(dbPath);

console.log("✅ Using SQLite database at:", dbPath);

const db = drizzle(sqlite, { schema });

export { db, sqlite as pool };
