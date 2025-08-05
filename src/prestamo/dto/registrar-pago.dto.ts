import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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