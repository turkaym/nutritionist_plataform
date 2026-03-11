import { z } from "zod";

const serverEnvSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    SESSION_COOKIE_NAME: z.string().min(1, "SESSION_COOKIE_NAME is required"),
    SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
    MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
    MERCADO_PAGO_WEBHOOK_SECRET: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    EMAIL_PROVIDER_API_KEY: z.string().optional(),
    SEED_ADMIN_EMAIL: z.string().optional(),
    SEED_ADMIN_PASSWORD: z.string().optional(),
    SEED_ADMIN_FIRST_NAME: z.string().optional(),
    SEED_ADMIN_LAST_NAME: z.string().optional(),
});

export const serverEnv = serverEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MERCADO_PAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    MERCADO_PAGO_WEBHOOK_SECRET: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
    SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
    SEED_ADMIN_FIRST_NAME: process.env.SEED_ADMIN_FIRST_NAME,
    SEED_ADMIN_LAST_NAME: process.env.SEED_ADMIN_LAST_NAME,
});