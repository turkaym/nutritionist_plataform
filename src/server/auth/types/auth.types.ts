export interface CreateSessionInput {
    userId: string;
    sessionTokenHash: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export interface RevokeSessionInput {
    sessionId: string;
    revokedAt: Date;
}