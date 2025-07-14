import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from 'src/dto/create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AuthResponseDto } from 'src/dto/auth.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<any> {

    const { name, email, password, phone, address, cedula, role = UserRole.ADMIN } = registerDto;

    //Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [
        { cedula },
        { email }
      ]
    });



    if (existingUser) {
      if (existingUser.cedula === cedula) {
        throw new ConflictException('El DNI de usuario ya está en uso');
      }
      if (existingUser.email === email) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
    }

    //Crear nuevo usuario
    const user = this.userRepository.create({
      email,
      name,
      password,
      phone,
      address,
      role,
      cedula
    });

    const savedUser = await this.userRepository.save(user);


    // Generar token JWT
    const payload = {
      sub: savedUser.id,
      name: savedUser.name,
      role: savedUser.role
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 86400, // 24 horas
      user: savedUser.toSafeObject,
    };
  }



  async validateUser(cedula: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { cedula } });

    if (user && await user.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.cedula, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = {
      sub: user.id,
      cedula: user.cedula,
      role: user.role,
      vendedorId: user.vendedorId
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        cedula: user.cedula,
        role: user.role,
        vendedorId: user.vendedorId
      }
    };
  }



}






