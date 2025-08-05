import { UserRole } from "src/user/entities/user.entity";

// src/auth/dto/auth-response.dto.ts
export class AuthResponseDto {
    access_token: string;
    user: {
        id: string;
        cedula: string;
        email: string;
        role: UserRole;
        profile?: any;
    };
}