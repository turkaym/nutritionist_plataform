import { db } from "@/server/db";
import type { DatabaseExecutor } from "./types";

export const database: DatabaseExecutor = db;