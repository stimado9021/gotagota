import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LoansModule } from './loans/loans.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';


@Module({
  //'postgresql://neondb_owner:npg_Th3P0LZKVxWq@ep-shiny-frog-a8h3mngk-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,

    }),
    UserModule,
    LoansModule,
    PaymentModule,
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
