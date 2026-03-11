import "../bootstrap-env";
import { eq } from "drizzle-orm";

import { roles } from "@/../drizzle/schema";
import { db } from "@/server/db";

const DEFAULT_ROLES = [
    {
        code: "admin",
        name: "Admin",
        description: "System administrator with elevated privileges.",
        is_system: true,
    },
    {
        code: "customer",
        name: "Customer",
        description: "Authenticated customer who can purchase services.",
        is_system: true,
    },
] as const;

export async function seedRoles() {
    for (const role of DEFAULT_ROLES) {
        const [existingRole] = await db
            .select({
                id: roles.id,
                code: roles.code,
            })
            .from(roles)
            .where(eq(roles.code, role.code))
            .limit(1);

        if (!existingRole) {
            await db.insert(roles).values({
                code: role.code,
                name: role.name,
                description: role.description,
                is_system: role.is_system,
            });

            console.log(`Created role: ${role.code}`);
            continue;
        }

        console.log(`Role already exists: ${role.code}`);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    seedRoles()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error("Role seed failed.");
            console.error(error);
            process.exit(1);
        });
}