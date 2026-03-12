import { and, eq, isNull } from "drizzle-orm";

import { users } from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const userAuthSelect = {
    id: users.id,
    role_id: users.role_id,
    first_name: users.first_name,
    last_name: users.last_name,
    email: users.email,
    password_hash: users.password_hash,
    status: users.status,
    email_verified: users.email_verified,
    email_verified_at: users.email_verified_at,
    last_login_at: users.last_login_at,
    deleted_at: users.deleted_at,
    created_at: users.created_at,
    updated_at: users.updated_at,
};

const userPublicSelect = {
    id: users.id,
    role_id: users.role_id,
    first_name: users.first_name,
    last_name: users.last_name,
    email: users.email,
    status: users.status,
    email_verified: users.email_verified,
    email_verified_at: users.email_verified_at,
    last_login_at: users.last_login_at,
    created_at: users.created_at,
    updated_at: users.updated_at,
};

export function createUsersRepository(executor: DatabaseExecutor = database) {
    return {
        async findById(userId: string) {
            const [user] = await executor
                .select(userAuthSelect)
                .from(users)
                .where(and(eq(users.id, userId), isNull(users.deleted_at)))
                .limit(1);

            return user ?? null;
        },

        async findByEmail(email: string) {
            const normalizedEmail = email.trim().toLowerCase();

            const [user] = await executor
                .select(userAuthSelect)
                .from(users)
                .where(
                    and(
                        eq(users.email, normalizedEmail),
                        isNull(users.deleted_at),
                    ),
                )
                .limit(1);

            return user ?? null;
        },

        async findActiveByEmail(email: string) {
            const normalizedEmail = email.trim().toLowerCase();

            const [user] = await executor
                .select(userAuthSelect)
                .from(users)
                .where(
                    and(
                        eq(users.email, normalizedEmail),
                        eq(users.status, "active"),
                        isNull(users.deleted_at),
                    ),
                )
                .limit(1);

            return user ?? null;
        },

        async findPublicProfileById(userId: string) {
            const [user] = await executor
                .select(userPublicSelect)
                .from(users)
                .where(and(eq(users.id, userId), isNull(users.deleted_at)))
                .limit(1);

            return user ?? null;
        },

        async updateLastLoginAt(userId: string, lastLoginAt: Date) {
            const [user] = await executor
                .update(users)
                .set({
                    last_login_at: lastLoginAt,
                    updated_at: lastLoginAt,
                })
                .where(and(eq(users.id, userId), isNull(users.deleted_at)))
                .returning(userAuthSelect);

            return user ?? null;
        },
    };
}