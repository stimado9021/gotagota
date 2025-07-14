import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "src/entities";


export class RegisterDto {
    @ApiProperty({
        description: 'Nombre de usuario único',
        example: 'johndoe',
        minLength: 3,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'john@example.com',
        format: 'email',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

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


    @ApiProperty({
        description: 'telefono del usuario',
        example: '+584246617734',
        minLength: 10,
        maxLength: 14,
    })
    @IsString()
    @MinLength(10)
    @MaxLength(14)
    phone: string;

    @ApiProperty({
        description: 'direccion del usuario',
        example: 'san lukas sur calle 44 #39-45 ',
        minLength: 10,
        maxLength: 100,
    })
    @IsString()
    @MinLength(10)
    @MaxLength(100)
    address: string;

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: '1140911464',
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(14)
    cedula: string;

    @ApiProperty({
        description: 'Rol del usuario (opcional, por defecto USER)',
        enum: UserRole,
        example: UserRole.ADMIN,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}

