export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginRequestContext = {
    ipAddress?: string | null;
    userAgent?: string | null;
};

export type LoginInput = {
    credentials: LoginCredentials;
    context?: LoginRequestContext;
};