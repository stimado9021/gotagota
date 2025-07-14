import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/entities";

export class AuthResponseDto {

  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tiempo de expiración en segundos',
    example: 86400,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      username: { type: 'string', example: 'johndoe' },
      email: { type: 'string', example: 'john@example.com' },
      fullName: { type: 'string', example: 'John Doe' },
      role: { type: 'string', example: 'user' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
      updatedAt: { type: 'string', example: '2025-01-01T00:00:00.000Z' }
    }
  })


  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}