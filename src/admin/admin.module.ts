import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendedor, Prestamo, Auth])
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
