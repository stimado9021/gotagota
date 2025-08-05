import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { PrestamosService } from 'src/prestamo/prestamos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('cliente')
@UseGuards(JwtAuthGuard)
export class ClienteController {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Prestamo)
    private prestamoRepository: Repository<Prestamo>,
    private readonly prestamosService: PrestamosService,
  ) { }

  @Get('prestamo/calendario')
  @Roles(UserRole.CLIENT)
  async getCalendarioCliente(@Request() req) {
    const userId = req.user['id'];
    // Buscar cliente asociado a ese userId
    const cliente = await this.clienteRepository.findOne({
      where: { userId, isActive: true }
    });

    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    // Buscar préstamo activo del cliente
    const prestamo = await this.prestamoRepository.findOne({
      where: { clienteId: cliente.id, isActive: true },
    });

    if (!prestamo) {
      throw new Error('No tienes un préstamo activo');
    }

    return this.prestamosService.getCalendarioPagos(prestamo.vendedorId, prestamo.id);
  }
}