import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'cedula del usuario',
        example: '10440747',
        minLength: 8,
        maxLength: 14,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(14)
    cedula: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password123',
        minLength: 6,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}