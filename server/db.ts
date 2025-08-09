
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use PostgreSQL database with connection from environment variables
const connectionString = process.env.DATABASE_URL!;

console.log("✅ Using PostgreSQL database");

// Create the connection
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

export { db, client as pool };
