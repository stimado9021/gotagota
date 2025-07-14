import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { cedula: createUserDto.cedula }
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con esa cédula');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      // relations: ['lean', 'client'],
      where: { isActive: true }
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['lean', 'client', 'prestamosComoCliente', 'prestamosComoVendedor']
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByCedula(cedula: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { cedula }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findClientesByVendedor(lenasId: string): Promise<User[]> {
    return await this.userRepository.find({
      // where: { lenderLoans, isActive: true },
      // relations: ['prestamosComoCliente']
    });
  }

  async findVendedores(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.LENDER, isActive: true },
      // relations: ['clientes']
    });
  }

  async update(id: string, updateData: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findOne(id);

    if (updateData.cedula && updateData.cedula !== user.cedula) {
      const existingUser = await this.userRepository.findOne({
        where: { cedula: updateData.cedula }
      });
      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con esa cédula');
      }
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }
}
