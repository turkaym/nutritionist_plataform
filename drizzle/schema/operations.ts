import { relations } from "drizzle-orm";
import {
    index,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import {
    auditActorTypeEnum,
    contactMessageStatusEnum,
    createIdColumn,
    createdAtColumn,
    updatedAtColumn,
} from "./common";

export const contactMessages = pgTable(
    "contact_messages",
    {
        id: createIdColumn(),
        full_name: text("full_name").notNull(),
        email: text("email").notNull(),
        phone: text("phone"),
        subject: text("subject"),
        message: text("message").notNull(),
        status: contactMessageStatusEnum("status").default("new").notNull(),
        resolved_at: timestamp("resolved_at", { withTimezone: true }),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        contactMessagesEmailIdx: index("contact_messages_email_idx").on(table.email),
        contactMessagesStatusIdx: index("contact_messages_status_idx").on(
            table.status,
        ),
        contactMessagesCreatedAtIdx: index("contact_messages_created_at_idx").on(
            table.created_at,
        ),
    }),
);

export const adminAuditLogs = pgTable(
    "admin_audit_logs",
    {
        id: createIdColumn(),
        actor_type: auditActorTypeEnum("actor_type").default("user").notNull(),
        actor_user_id: uuid("actor_user_id").references(() => users.id, {
            onDelete: "set null",
            onUpdate: "cascade",
        }),
        action: text("action").notNull(),
        entity_type: text("entity_type").notNull(),
        entity_id: uuid("entity_id"),
        target_label: text("target_label"),
        metadata_raw: text("metadata_raw"),
        ip_address: text("ip_address"),
        user_agent: text("user_agent"),
        created_at: createdAtColumn(),
    },
    (table) => ({
        adminAuditLogsActorUserIdx: index("admin_audit_logs_actor_user_idx").on(
            table.actor_user_id,
        ),
        adminAuditLogsActionIdx: index("admin_audit_logs_action_idx").on(
            table.action,
        ),
        adminAuditLogsEntityTypeIdx: index("admin_audit_logs_entity_type_idx").on(
            table.entity_type,
        ),
        adminAuditLogsEntityIdIdx: index("admin_audit_logs_entity_id_idx").on(
            table.entity_id,
        ),
        adminAuditLogsCreatedAtIdx: index("admin_audit_logs_created_at_idx").on(
            table.created_at,
        ),
    }),
);

export const adminAuditLogsRelations = relations(adminAuditLogs, ({ one }) => ({
    actorUser: one(users, {
        fields: [adminAuditLogs.actor_user_id],
        references: [users.id],
    }),
}));