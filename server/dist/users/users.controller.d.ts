import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }[]>;
    findOne(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    updateProfile(user: any, data: {
        name?: string;
        email?: string;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    changePassword(user: any, data: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
