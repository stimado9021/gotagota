import { IsNumber, IsUUID, IsDateString, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreatePaymentDto {
    @IsUUID()
    prestamoId: string;

    @IsDateString()
    fecha: string;

    @IsNumber()
    @Min(0)
    monto: number;

    @IsBoolean()
    @IsOptional()
    esPagoDoble?: boolean;

    @IsDateString()
    @IsOptional()
    fechaOriginal?: string;


    @IsOptional()
    notas?: string;
}

// dto/login.dto.ts
import { IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    cedula: string;

    @IsString()
    password: string;
}

