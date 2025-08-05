// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
  BadRequestException,
  Param,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {
    // Extraer el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover 'Bearer ' del inicio
    return await this.authService.logout(token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    let profile;
    switch (user.role) {
      case UserRole.CLIENT:
        profile = user.cliente;
        break;
      case UserRole.SELLER:
        profile = user.vendedor;
        break;
      case UserRole.ADMIN:
        profile = user.admin;
        break;
    }

    return {
      id: user.id,
      cedula: user.cedula,
      email: user.email,
      role: user.role,
      profile: profile,
    };
  }

  // Obtener lista de vendedores activos
  @Get('sellers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  async getAllSellers() {
    return await this.authService.getAllSellers();
  }


  @Get('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  async getAllClient() {
    return await this.authService.getAllClient();
  }

  // Obtener todos los clientes de un vendedor específico
  @Get('seller/:id/clients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  async getClientsBySeller(@Param('id') sellerId: string, @CurrentUser() user: User) {
    // Validar que el ID sea un UUID válido (opcional)

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sellerId)) {
      throw new BadRequestException('ID de vendedor inválido');
    }
    console.log(user.role);
    // Si es un vendedor, solo puede ver sus propios clientes
    if (user.role === UserRole.SELLER) {
      if (!user.vendedor || !user.admin || user.vendedor.id !== sellerId) {
        throw new UnauthorizedException('No tienes permisos para ver los clientes de otro vendedor');
      }
    }

    return await this.authService.getClientsBySeller(sellerId);
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminOnly(@CurrentUser() user: User) {
    return {
      message: 'Este endpoint es solo para administradores',
      user: user.admin,
    };
  }

  @Get('seller-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async sellerOnly(@CurrentUser() user: User) {
    return {
      message: 'Este endpoint es solo para vendedores',
      user: user.vendedor,
    };
  }

  @Get('client-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  async clientOnly(@CurrentUser() user: User) {
    return {
      message: 'Este endpoint es solo para clientes',
      user: user.cliente,
    };
  }

  @Get('seller-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async sellerAndAdmin(@CurrentUser() user: User) {
    return {
      message: 'Este endpoint es para vendedores y administradores',
      user: {
        role: user.role,
        profile: user.role === UserRole.SELLER ? user.vendedor : user.admin,
      },
    };
  }
}