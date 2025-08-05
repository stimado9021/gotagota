import { Controller, Post, Get, Body, Param, Query, UseGuards, Request, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateClientePrestamoDto } from './dto/create-cliente-prestamo.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { EstadoPrestamo } from './entities/prestamo.entity';

@Controller('prestamos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER)
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) { }

  @Post('crear-cliente-prestamo')
  async createClienteConPrestamo(
    @Request() req,
    @Body() createDto: CreateClientePrestamoDto
  ) {
    // Obtener vendedor del token JWT
    const user = req.user;
    const vendedor = user.vendedor;

    return await this.prestamosService.createClienteConPrestamo(vendedor.id, createDto);
  }

  @Post('create-prestamo')
  async createPrestamo(
    @Request() req,
    @Body() createDto: CreatePrestamoDto
  ) {
    const user = req.user;
    const vendedor = user.vendedor;
    console.log(user, createDto)
    return await this.prestamosService.createPrestamo(vendedor.id, createDto);
  }

  @Get()
  async getMyPrestamos(
    @Request() req,
    @Query('estado') estado?: EstadoPrestamo
  ) {
    const user = req.user;
    const vendedor = user.vendedor;

    return await this.prestamosService.getPrestamosByVendedor(vendedor.id, estado);
  }

  @Get(':id')
  async getPrestamoDetalle(
    @Request() req,
    @Param('id') prestamoId: string
  ) {
    const user = req.user;
    const vendedor = user.vendedor;

    return await this.prestamosService.getPrestamoDetalle(vendedor.id, prestamoId);
  }

  @Post(':id/pagos')
  async registrarPago(
    @Request() req,
    @Param('id') prestamoId: string,
    @Body() pagoDto: RegistrarPagoDto
  ) {

    const user = req.user;
    const vendedor = user.vendedor;
    console.log(prestamoId, pagoDto, vendedor.id)
    return await this.prestamosService.registrarPago(vendedor.id, prestamoId, pagoDto);
  }

  @Get(':id/calendario')
  async getCalendarioPagos(
    @Param('id') prestamoId: string,
    @Request() req,
  ) {
    const user = req.user;
    const vendedor = user.vendedor;
    const vendedorId = vendedor.id;
    return this.prestamosService.getCalendarioPagos(vendedorId, prestamoId);
  }

}