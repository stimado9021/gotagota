import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBody, ApiConflictResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/dto/create-auth.dto';
import { AuthResponseDto } from 'src/dto/auth.response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto)
    return await this.authService.login(loginDto);
  }


  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema. El usuario se crea con rol "user" por defecto.'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos del nuevo usuario'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto
  })
  @ApiConflictResponse({
    description: 'El nombre de usuario o email ya están en uso',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'El nombre de usuario ya está en uso' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {

    return this.authService.register(registerDto);
  }


}