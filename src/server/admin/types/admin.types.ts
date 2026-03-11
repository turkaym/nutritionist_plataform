export interface CreateAdminAuditLogInput {
    actorType?: "user";
    actorUserId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    targetLabel?: string | null;
    metadataRaw?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}