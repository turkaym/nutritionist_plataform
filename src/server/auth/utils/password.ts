import bcrypt from "bcryptjs";

import { AUTH_BCRYPT_ROUNDS } from "@/server/auth/constants/auth.constants";

export async function hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, AUTH_BCRYPT_ROUNDS);
}

export async function verifyPassword(
    plainPassword: string,
    passwordHash: string,
): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
}