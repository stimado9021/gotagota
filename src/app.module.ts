// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { User } from 'src/user/entities/user.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { Admin } from 'src/admin/entities/admin.entity';
// import { PrestamoResolver } from './prestamo/prestamo.resolver';
import { PrestamoModule } from './prestamo/prestamos.module';
import { Prestamo } from './prestamo/entities/prestamo.entity';
import { PagoPrestamo } from './prestamo/entities/pago-prestamo.entity';
import { ClienteModule } from './cliente/cliente.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'cocodrijo2'),
        entities: [User, Cliente, Vendedor, Admin, Prestamo, PagoPrestamo],
        synchronize: configService.get('NODE_ENV') !== 'production',
        dropSchema: false,
        // logging: configService.get('NODE_ENV') === 'development',
        ssl: {
          rejectUnauthorized: false, // 👈 importante para conexiones SSL en ambientes no verificados
        },
      }),

      inject: [ConfigService],
    }),
    AuthModule,
    PrestamoModule,
    ClienteModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }