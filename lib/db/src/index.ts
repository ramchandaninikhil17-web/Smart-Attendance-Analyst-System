import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Auto-load .env file if available in process working directory
try {
  // @ts-ignore
  process.loadEnvFile?.();
} catch {
  // Environment file absent or already loaded via CLI
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const rawConnectionString = process.env.DATABASE_URL;
const isSupabaseOrCloud =
  rawConnectionString.includes("supabase.co") ||
  rawConnectionString.includes("pooler.supabase.com") ||
  rawConnectionString.includes("sslmode=require") ||
  process.env.NODE_ENV === "production";

// Strip sslmode from URL when using the ssl config object directly.
// pg v8.23+ treats URL sslmode=require as verify-full, which rejects
// Supabase pooler's self-signed certificates. We handle SSL via the
// Pool config object instead with rejectUnauthorized: false.
let connectionString = rawConnectionString;
if (isSupabaseOrCloud) {
  try {
    const parsed = new URL(rawConnectionString);
    parsed.searchParams.delete("sslmode");
    connectionString = parsed.toString();
  } catch {
    // If URL parsing fails, use as-is
  }
}

export const pool = new Pool({
  connectionString,
  ssl: isSupabaseOrCloud ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
