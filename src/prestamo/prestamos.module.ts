import { Module } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { PagoPrestamo } from './entities/pago-prestamo.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prestamo,
      PagoPrestamo,
      Cliente,
      Vendedor,
      User
    ])
  ],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamoModule { }
