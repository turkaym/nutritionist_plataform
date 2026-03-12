import type { AuthCookiePayload } from "./auth-cookie";
import type { AuthenticatedUser } from "./auth-user";

export type ActiveSession = {
    id: string;
    userId: string;
    expiresAt: Date;
};

export type LoginResult = {
    session: ActiveSession;
    sessionToken: string;
    sessionExpiresAt: Date;
    cookie: AuthCookiePayload;
    user: AuthenticatedUser;
};

export type CurrentSessionResult = {
    session: ActiveSession;
    user: AuthenticatedUser;
};