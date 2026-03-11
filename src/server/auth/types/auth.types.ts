export interface CreateSessionInput {
    userId: string;
    sessionToken: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export interface RevokeSessionInput {
    sessionId: string;
    revokedAt: Date;
}