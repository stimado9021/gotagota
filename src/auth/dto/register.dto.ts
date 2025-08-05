// src/auth / dto / register.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsEnum, MinLength, MaxLength, IsOptional, IsDateString, IsDecimal, IsPhoneNumber } from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    cedula: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;

    // Datos específicos según el rol
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    // Campos específicos para cliente
    @IsDateString()
    @IsOptional()
    fechaNacimiento?: Date;

    @IsString()
    @IsOptional()
    profesion?: string;

    @IsDecimal()
    @IsOptional()
    ingresosMensuales?: number;

    @IsString()
    @IsOptional()
    referencias?: string;

    // Campos específicos para vendedor
    @IsDateString()
    @IsOptional()
    fechaIngreso?: Date;

    @IsString()
    @IsOptional()
    sucursal?: string;

    @IsDecimal()
    @IsOptional()
    comisionPorcentaje?: number;

    // Campos específicos para admin
    @IsString()
    @IsOptional()
    cargo?: string;

    @IsString()
    @IsOptional()
    permisos?: string;
}