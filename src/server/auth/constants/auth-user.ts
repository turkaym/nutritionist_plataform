export type AuthenticatedUserRole = {
    id: string;
    code: string;
    name: string;
};

export type AuthenticatedUser = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: AuthenticatedUserRole;
};