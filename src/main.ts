
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Configurar CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Usuarios')
    .setDescription(`
      API completa para la gestión de usuarios con autenticación JWT.
     
    `)
    .setVersion('1.0.0')
    .setContact(
      'Equipo de Desarrollo',
      'https://stimado9021.github.io/portafolio_SoyHenry/',
      'rodev@gmail.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth', // Este nombre se usa en los decoradores
    )
    .addTag('Autenticación', 'Endpoints para login, registro y gestión de tokens')
    .addTag('Usuarios', 'Operaciones CRUD para usuarios')
    .addTag('Administración', 'Endpoints administrativos (requieren rol admin)')
    .addTag('Salud', 'Endpoints de monitoreo y salud del sistema')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configurar la ruta de Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantener el token después de refresh
      deepLinking: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      operationsSorter: 'method',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'API de Gestión de Usuarios - Documentación',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
  });

  // Configurar prefijo global para las rutas
  //app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3001);

  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${process.env.PORT}`);
  //console.log(`📚 Documentación Swagger: http://localhost:${process.env.PORT}/api/docs`);
  //console.log(`🏥 Health check: http://localhost:${process.env.PORT}/api/health`);
}

bootstrap();
