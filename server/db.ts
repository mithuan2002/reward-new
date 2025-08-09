
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use PostgreSQL database with connection from environment variables
const connectionString = process.env.DATABASE_URL!;

console.log("✅ Using PostgreSQL database");

// Create the connection with configuration to avoid hanging
const client = postgres(connectionString, { 
  prepare: false,
  max: 2,
  transform: postgres.camel,
  connection: {
    application_name: 'nambi-app'
  }
});
const db = drizzle(client, { schema });

export { db, client as pool };
