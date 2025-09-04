import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "@/lib/config";
import { performanceMonitor } from "@/lib/performance";

// Create optimized database connection
const sql = neon(config.env.databaseUrl, {
  // Connection pool settings
  arrayMode: false,
  fullResults: false,
});

// Create drizzle instance with optimizations
export const db = drizzle({ 
  client: sql,
  // Enable query logging in development
  logger: process.env.NODE_ENV === 'development',
});

// Wrapped database functions with performance monitoring
export const dbWithMonitoring = {
  // Execute query with performance monitoring
  async execute<T>(queryName: string, query: () => Promise<T>): Promise<T> {
    return performanceMonitor.measureDbQuery(queryName, query);
  },

  // Get the underlying db instance
  get db() {
    return db;
  },
};
