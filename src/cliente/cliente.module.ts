import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { PrestamosService } from 'src/prestamo/prestamos.service';
import { ClienteController } from './cliente.controller';
import { User } from 'src/user/entities/user.entity';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity'
import { Cliente } from './entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoPrestamo } from 'src/prestamo/entities/pago-prestamo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cliente, Vendedor, Prestamo,
      PagoPrestamo]),
  ],
  controllers: [ClienteController],
  providers: [ClienteService, PrestamosService],
})
export class ClienteModule { }
