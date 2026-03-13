import type { AuthenticatedUser } from "@/server/auth/contracts/auth-user";

export interface AuthenticatedActor {
    sessionId: string;
    sessionUserId: string;
    sessionExpiresAt: Date;
    user: AuthenticatedUser;
}