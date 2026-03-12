import { AUTH_COOKIE_NAME, AUTH_SAME_SITE } from "@/server/auth/constants/auth.constants";

export type SessionCookieOptions = {
    name: string;
    value: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    path: string;
    expires: Date;
};

export function buildSessionCookieOptions(
    sessionToken: string,
    expiresAt: Date,
): SessionCookieOptions {
    return {
        name: AUTH_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: AUTH_SAME_SITE,
        path: "/",
        expires: expiresAt,
    };
}

export function buildExpiredSessionCookieOptions(): SessionCookieOptions {
    return {
        name: AUTH_COOKIE_NAME,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: AUTH_SAME_SITE,
        path: "/",
        expires: new Date(0),
    };
}