// src/prestamos / dto / create - prestamo.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPrestamo } from '../entities/prestamo.entity';

export class CreatePrestamoDto {
    @IsNotEmpty()
    @IsString()
    clienteId: string;

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