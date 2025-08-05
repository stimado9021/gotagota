// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from 'src/user/entities/user.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from 'src/auth/dto/auth.response.dto';

@Injectable()
export class AuthService {
  // Set para almacenar tokens en lista negra (blacklist)
  private blacklistedTokens = new Set<string>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { cedula, email, password, role, ...profileData } = registerDto;
    console.log('aqui esta la variable ', profileData);
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ cedula }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con esa cédula o email');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario base
    const user = this.userRepository.create({
      cedula,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    // Crear el perfil específico según el rol
    let profile;
    switch (role) {
      case UserRole.CLIENT:
        profile = this.clienteRepository.create({
          ...profileData,
          userId: savedUser.id,
        });
        await this.clienteRepository.save(profile);
        break;

      case UserRole.SELLER:
        profile = this.vendedorRepository.create({
          ...profileData,
          fechaIngreso: profileData.fechaIngreso || new Date(),
          userId: savedUser.id,
        });
        await this.vendedorRepository.save(profile);
        break;

      case UserRole.ADMIN:
        profile = this.adminRepository.create({
          ...profileData,
          fechaIngreso: profileData.fechaIngreso || new Date(),
          userId: savedUser.id,
        });
        await this.adminRepository.save(profile);
        break;
    }

    // Generar JWT token
    const payload = { sub: savedUser.id, cedula: savedUser.cedula, role: savedUser.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        cedula: savedUser.cedula,
        email: savedUser.email,
        role: savedUser.role,
        profile: profile,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { cedula, password } = loginDto;

    // Buscar usuario con su perfil correspondiente
    const user = await this.userRepository.findOne({
      where: { cedula, isActive: true },
      relations: ['cliente', 'vendedor', 'admin'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Obtener el perfil específico según el rol
    let profile;
    switch (user.role) {
      case UserRole.CLIENT:
        profile = user.cliente;
        break;
      case UserRole.SELLER:
        profile = user.vendedor;
        if (!profile?.isActive) {
          throw new UnauthorizedException('Vendedor inactivo');
        }
        break;
      case UserRole.ADMIN:
        profile = user.admin;
        if (!profile?.isActive) {
          throw new UnauthorizedException('Administrador inactivo');
        }
        break;
    }

    // Generar JWT token
    const payload = { sub: user.id, cedula: user.cedula, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        cedula: user.cedula,
        email: user.email,
        role: user.role,
        profile: profile,
      },
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      // Verificar que el token sea válido antes de agregarlo a la blacklist
      const decoded = this.jwtService.verify(token);

      // Agregar el token a la lista negra
      this.blacklistedTokens.add(token);

      return {
        message: 'Logout exitoso'
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  // Método para verificar si un token está en la blacklist
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
      relations: ['cliente', 'vendedor', 'admin'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // Método opcional para limpiar tokens expirados de la blacklist
  cleanExpiredTokens(): void {
    const currentTime = Math.floor(Date.now() / 1000);

    this.blacklistedTokens.forEach(token => {
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded && decoded.exp && decoded.exp < currentTime) {
          this.blacklistedTokens.delete(token);
        }
      } catch (error) {
        // Si no se puede decodificar, eliminarlo de la blacklist
        this.blacklistedTokens.delete(token);
      }
    });
  }

  // Listar todos los vendedores activos
  async getAllSellers(): Promise<Vendedor[]> {
    return await this.vendedorRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });
  }

  async getAllClient(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });
  }

  // Listar todos los clientes de un vendedor por ID
  async getClientsBySeller(sellerId: string): Promise<Cliente[]> {
    // Verifica que el vendedor existe y está activo
    const seller = await this.vendedorRepository.findOne({
      where: { id: sellerId, isActive: true },
      relations: ['clientes'],
    });



    if (!seller) {
      throw new BadRequestException('Vendedor no encontrado o inactivo');
    }
    console.log(seller.clientes);
    // Devuelve los clientes asociados
    return seller.clientes || [];
  }
}