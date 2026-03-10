import postgres from "postgres";
import { serverEnv } from "@/lib/env/server";

export const sql = postgres(serverEnv.DATABASE_URL, {
    max: 10,
    prepare: false,
});