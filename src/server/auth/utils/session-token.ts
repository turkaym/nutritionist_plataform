import { createHash, randomBytes } from "node:crypto";

import { AUTH_SESSION_TTL_SECONDS } from "@/server/auth/constants/auth.constants";

export function generateSessionToken(): string {
    return randomBytes(32).toString("hex");
}

export function hashSessionToken(sessionToken: string): string {
    return createHash("sha256").update(sessionToken).digest("hex");
}

export function calculateSessionExpiresAt(
    now: Date = new Date(),
    ttlSeconds: number = AUTH_SESSION_TTL_SECONDS,
): Date {
    return new Date(now.getTime() + ttlSeconds * 1000);
}