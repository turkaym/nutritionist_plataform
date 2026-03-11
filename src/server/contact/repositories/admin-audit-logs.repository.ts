import { desc, eq } from "drizzle-orm";

import { adminAuditLogs } from "@/../drizzle/schema";
import type { CreateAdminAuditLogInput } from "@/server/admin/types/admin.types";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const adminAuditLogSelect = {
    id: adminAuditLogs.id,
    actor_type: adminAuditLogs.actor_type,
    actor_user_id: adminAuditLogs.actor_user_id,
    action: adminAuditLogs.action,
    entity_type: adminAuditLogs.entity_type,
    entity_id: adminAuditLogs.entity_id,
    target_label: adminAuditLogs.target_label,
    metadata_raw: adminAuditLogs.metadata_raw,
    ip_address: adminAuditLogs.ip_address,
    user_agent: adminAuditLogs.user_agent,
    created_at: adminAuditLogs.created_at,
};

export function createAdminAuditLogsRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async createAuditLog(input: CreateAdminAuditLogInput) {
            const [auditLog] = await executor
                .insert(adminAuditLogs)
                .values({
                    actor_type: input.actorType ?? "user",
                    actor_user_id: input.actorUserId ?? null,
                    action: input.action,
                    entity_type: input.entityType,
                    entity_id: input.entityId ?? null,
                    target_label: input.targetLabel ?? null,
                    metadata_raw: input.metadataRaw ?? null,
                    ip_address: input.ipAddress ?? null,
                    user_agent: input.userAgent ?? null,
                })
                .returning(adminAuditLogSelect);

            return auditLog;
        },

        async findById(auditLogId: string) {
            const [auditLog] = await executor
                .select(adminAuditLogSelect)
                .from(adminAuditLogs)
                .where(eq(adminAuditLogs.id, auditLogId))
                .limit(1);

            return auditLog ?? null;
        },

        async listRecent(limit = 50) {
            const rows = await executor
                .select(adminAuditLogSelect)
                .from(adminAuditLogs)
                .orderBy(desc(adminAuditLogs.created_at))
                .limit(limit);

            return rows;
        },
    };
}