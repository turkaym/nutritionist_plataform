import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import {
    createIdColumn,
    createdAtColumn,
    deletedAtColumn,
    expiresAtColumn,
    updatedAtColumn,
    userStatusEnum,
} from "./common";

export const roles = pgTable(
    "roles",
    {
        id: createIdColumn(),
        code: text("code").notNull(),
        name: text("name").notNull(),
        description: text("description"),
        is_system: boolean("is_system").default(true).notNull(),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        rolesCodeUniqueIdx: uniqueIndex("roles_code_unique_idx").on(table.code),
        rolesNameUniqueIdx: uniqueIndex("roles_name_unique_idx").on(table.name),
    }),
);

export const users = pgTable(
    "users",
    {
        id: createIdColumn(),
        role_id: uuid("role_id")
            .notNull()
            .references(() => roles.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        first_name: text("first_name"),
        last_name: text("last_name"),
        email: text("email").notNull(),
        password_hash: text("password_hash").notNull(),
        status: userStatusEnum("status").default("active").notNull(),
        email_verified: boolean("email_verified").default(false).notNull(),
        email_verified_at: timestamp("email_verified_at", { withTimezone: true }),
        last_login_at: timestamp("last_login_at", { withTimezone: true }),
        deleted_at: deletedAtColumn(),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        usersEmailUniqueIdx: uniqueIndex("users_email_unique_idx").on(table.email),
        usersRoleIdx: index("users_role_idx").on(table.role_id),
        usersStatusIdx: index("users_status_idx").on(table.status),
    }),
);

export const sessions = pgTable(
    "sessions",
    {
        id: createIdColumn(),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        session_token: text("session_token").notNull(),
        ip_address: text("ip_address"),
        user_agent: text("user_agent"),
        expires_at: expiresAtColumn().notNull(),
        revoked_at: timestamp("revoked_at", { withTimezone: true }),
        last_seen_at: timestamp("last_seen_at", { withTimezone: true }),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        sessionsTokenUniqueIdx: uniqueIndex("sessions_token_unique_idx").on(
            table.session_token,
        ),
        sessionsUserIdx: index("sessions_user_idx").on(table.user_id),
        sessionsExpiresAtIdx: index("sessions_expires_at_idx").on(table.expires_at),
    }),
);

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.role_id],
        references: [roles.id],
    }),
    sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.user_id],
        references: [users.id],
    }),
}));