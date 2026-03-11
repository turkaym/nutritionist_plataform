import "../bootstrap-env";

import bcrypt from "bcryptjs";
import { and, eq, isNull } from "drizzle-orm";

import { roles, users } from "@/../drizzle/schema";
import { serverEnv } from "@/lib/env/server";
import { db } from "@/server/db";

const ADMIN_PASSWORD_SALT_ROUNDS = 12;

function getAdminSeedConfig() {
    const email = serverEnv.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const password = serverEnv.SEED_ADMIN_PASSWORD?.trim();
    const firstName = serverEnv.SEED_ADMIN_FIRST_NAME?.trim() || null;
    const lastName = serverEnv.SEED_ADMIN_LAST_NAME?.trim() || null;

    if (!email || !password) {
        return null;
    }

    return {
        email,
        password,
        firstName,
        lastName,
    };
}

export async function seedAdmin() {
    const adminConfig = getAdminSeedConfig();

    if (!adminConfig) {
        console.log("Skipping admin seed: missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD.");
        return;
    }

    const [adminRole] = await db
        .select({
            id: roles.id,
            code: roles.code,
        })
        .from(roles)
        .where(eq(roles.code, "admin"))
        .limit(1);

    if (!adminRole) {
        throw new Error("Admin role not found. Run role seed before admin seed.");
    }

    const [existingAdmin] = await db
        .select({
            id: users.id,
            email: users.email,
        })
        .from(users)
        .where(
            and(
                eq(users.email, adminConfig.email),
                isNull(users.deleted_at),
            ),
        )
        .limit(1);

    if (existingAdmin) {
        console.log(`Admin user already exists: ${adminConfig.email}`);
        return;
    }

    const passwordHash = await bcrypt.hash(
        adminConfig.password,
        ADMIN_PASSWORD_SALT_ROUNDS,
    );

    const [createdAdmin] = await db
        .insert(users)
        .values({
            role_id: adminRole.id,
            first_name: adminConfig.firstName,
            last_name: adminConfig.lastName,
            email: adminConfig.email,
            password_hash: passwordHash,
            status: "active",
            email_verified: true,
            email_verified_at: new Date(),
        })
        .returning({
            id: users.id,
            email: users.email,
        });

    console.log(`Created admin user: ${createdAdmin.email}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    seedAdmin()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error("Admin seed failed.");
            console.error(error);
            process.exit(1);
        });
}