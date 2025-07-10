import { IsString, IsEmail, IsOptional, IsEnum, MinLength, IsUUID } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsString()
  cedula: string;

  @IsString()
  telefono: string;

  @IsString()
  direccion: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsUUID()
  @IsOptional()
  vendedorId?: string;
}
