import { neon } from "@neondatabase/serverless";

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(process.env.DATABASE_URL);
}

// Tagged template literal helper — creates a fresh neon instance per call
export const sql = (strings: TemplateStringsArray, ...values: unknown[]) =>
  getDb()(strings, ...values);
