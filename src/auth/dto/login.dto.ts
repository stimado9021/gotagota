
// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    cedula: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}