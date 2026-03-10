import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "@/server/db/client";

export const db = drizzle(sql);