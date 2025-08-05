# Sistema de Préstamos - API REST

Sistema de gestión de préstamos desarrollado con NestJS, PostgreSQL y JWT para autenticación.

## 🚀 Características

- **Autenticación JWT** con roles diferenciados
- **Gestión de usuarios** por roles: Cliente, Vendedor, Admin
- **Base de datos PostgreSQL** con TypeORM
- **Validación de datos** con class-validator
- **Arquitectura modular** y escalable

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd prestamos-api
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
# Editar el archivo .env con tus configuraciones
```

4. **Crear la base de datos en PostgreSQL**

```sql
CREATE DATABASE prestamos_db;
```

5. **Ejecutar la aplicación**

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

6. **Ejecutar el seeder inicial (opcional)**

```bash
npm run seed
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                   # Módulo de autenticación
│   ├── dto/               # DTOs para login y registro
│   ├── guards/            # Guards JWT y roles
│   ├── strategies/        # Estrategia JWT
│   └── decorators/        # Decoradores personalizados
├── entities/              # Entidades TypeORM
│   ├── user.entity.ts     # Usuario base
│   ├── cliente.entity.ts  # Perfil de cliente
│   ├── vendedor.entity.ts # Perfil de vendedor
│   └── admin.entity.ts    # Perfil de administrador
├── database/              # Scripts de base de datos
└── main.ts               # Punto de entrada
```

## 🔑 Endpoints de Autenticación

### Registro de Usuario

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "cedula": "12345678",
  "password": "password123",
  "email": "usuario@ejemplo.com",
  "role": "cliente", // cliente | vendedor | admin
  "nombres": "Juan",
  "apellidos": "Pérez",
  "telefono": "+573001234567",
  "direccion": "Calle 123 #45-67",
  // Campos adicionales según el rol...
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "cedula": "12345678",
  "password": "password123"
}
```

### Obtener Perfil (Autenticado)

```http
GET /api/v1/auth/profile
Authorization: Bearer <jwt-token>
```

## 👥 Roles y Permisos

### Cliente

- Puede iniciar sesión y consultar su perfil
- Campos específicos: fecha de nacimiento, profesión, ingresos mensuales, referencias

### Vendedor

- Puede iniciar sesión y gestionar clientes (próximamente)
- Campos específicos: sucursal, comisión, ventas acumuladas

### Administrador

- Acceso completo al sistema
- Campos específicos: cargo, permisos especiales

## 🛡️ Endpoints Protegidos por Rol

```http
# Solo administradores
GET /api/v1/auth/admin-only
Authorization: Bearer <jwt-token>

# Solo vendedores
GET /api/v1/auth/seller-only
Authorization: Bearer <jwt-token>

# Solo clientes
GET /api/v1/auth/client-only
Authorization: Bearer <jwt-token>

# Vendedores y administradores
GET /api/v1/auth/seller-admin
Authorization: Bearer <jwt-token>
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia en modo desarrollo con hot reload

# Producción
npm run build             # Construye la aplicación
npm run start:prod        # Inicia en modo producción

# Base de datos
npm run seed              # Ejecuta el seeder inicial

# Testing
npm run test              # Ejecuta las pruebas unitarias
npm run test:e2e          # Ejecuta las pruebas end-to-end

# Código
npm run lint              # Ejecuta el linter
npm run format            # Formatea el código
```

## 👤 Usuarios de Prueba (Seeder)

Después de ejecutar `npm run seed`:

| Rol      | Cédula   | Password    | Email                  |
| -------- | -------- | ----------- | ---------------------- |
| Admin    | 12345678 | admin123    | admin@prestamos.com    |
| Vendedor | 87654321 | vendedor123 | vendedor@prestamos.com |
| Cliente  | 11223344 | cliente123  | cliente@ejemplo.com    |

## 🔄 Próximas Funcionalidades

- [ ] Gestión de préstamos
- [ ] Cálculo de intereses
- [ ] Sistema de pagos
- [ ] Reportes y estadísticas
- [ ] Notificaciones
- [ ] Dashboard para cada rol

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación por tokens
- **bcryptjs** - Encriptación de contraseñas
- **class-validator** - Validación de DTOs
- **Passport** - Middleware de autenticación

## 📝 Notas de Desarrollo

- Las contraseñas se encriptan usando bcryptjs con salt de 12 rounds
- Los tokens JWT tienen una expiración de 24 horas por defecto
- La aplicación usa transformación automática de tipos en los DTOs
- Se implementa soft delete para mantener integridad referencial

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
