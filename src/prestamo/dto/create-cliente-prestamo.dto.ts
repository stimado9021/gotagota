import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsNumber, IsPositive, IsEnum, IsDateString } from 'class-validator';
import { TipoPrestamo } from '../entities/prestamo.entity';
export class CreateClientePrestamoDto {
    // Datos del cliente
    @IsNotEmpty()
    @IsString()
    cedula: string;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;

    @IsNotEmpty()
    @IsString()
    direccion: string;

    @IsOptional()
    @IsString()
    ocupacion?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ingresos?: number;

    // Datos del préstamo
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    monto: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    tasaInteres: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    plazoMeses: number;

    @IsEnum(TipoPrestamo)
    tipo: TipoPrestamo;

    @IsDateString()
    fechaInicio: string;

    @IsOptional()
    @IsString()
    observaciones?: string;
}

// src/prestamos/dto/registrar-pago.dto.ts
export class RegistrarPagoDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    monto: number;

    @IsDateString()
    fechaPago: string;

    @IsOptional()
    @IsString()
    observaciones?: string;
}