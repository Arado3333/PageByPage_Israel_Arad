export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
    isActive?: boolean;
}

export type UserAndPassword = Pick<User, "email" | "password">

// Omit --> מוריד תכונות מסוימות
// Pick --> בוחר תכונות מסוימות
export type UserWithoutPassword = Omit<User, "password">;

// & --> מחבר בין שני סוגים
export type AdminUser = User & {
    isAdmin: boolean;
}
