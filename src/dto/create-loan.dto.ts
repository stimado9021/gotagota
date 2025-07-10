import { IsNumber, IsUUID, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateLoanDto {
    @IsUUID()
    clienteId: string;

    @IsNumber()
    @Min(0)
    montoOriginal: number;

    @IsNumber()
    @IsOptional()
    @Min(1000)
    cuotaDiaria?: number;

    @IsDateString()
    fechaInicio: string;
}

