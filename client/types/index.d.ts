export type { UserInfo };

declare global {
    interface UserInfo {
        [key: string];
        id?: string;
        googleId: string | null;
        firstName: string;
        middleName?: string;
        lastName: string;
        email: string;
        username: string;
        role: string;
        title?: string;
        phone?: string;
        country?: string;
        password: string;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string;
    }

    interface PostInfo {
        [key: string];
        id: string;
        userId: string;
        user: UserInfo;
        title: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string;
    }
}

