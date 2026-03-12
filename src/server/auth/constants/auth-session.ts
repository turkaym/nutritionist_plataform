import type { AuthenticatedUser } from "./auth-user";

export type ActiveSession = {
    id: string;
    userId: string;
    expiresAt: Date;
};

export type LoginResult = {
    sessionToken: string;
    sessionExpiresAt: Date;
    user: AuthenticatedUser;
};

export type CurrentSessionResult = {
    session: ActiveSession;
    user: AuthenticatedUser;
};