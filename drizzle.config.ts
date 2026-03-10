import { defineConfig } from "drizzle-kit";
import { serverEnv } from "./src/lib/env/server";

export default defineConfig({
    dialect: "postgresql",
    schema: "./drizzle/schema/index.ts",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: serverEnv.DATABASE_URL,
    },
    strict: true,
    verbose: true,
});