// src/database/seeder.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/user/entities/user.entity';

async function seed() {
    console.log('🌱 Iniciando seeder...');

    const app = await NestFactory.create(AppModule);
    const authService = app.get(AuthService);

    try {
        // Crear usuario administrador por defecto
        console.log('👤 Creando usuario administrador...');

        const adminData = {
            cedula: '12345678',
            password: 'admin123',
            email: 'admin@prestamos.com',
            role: UserRole.ADMIN,
            // Campos específicos del perfil de admin
            nombre: 'Sistema',
            apellido: 'Administrador',
            telefono: '+573001234567',
            direccion: 'Oficina Principal',
            cargo: 'Administrador del Sistema',
            permisos: JSON.stringify(['all']),
            fechaIngreso: new Date(),
        };

        await authService.register(adminData);
        console.log('✅ Usuario administrador creado exitosamente');
        console.log('   Cédula: 12345678');
        console.log('   Password: admin123');

        // Crear un vendedor de ejemplo
        console.log('👨‍💼 Creando vendedor de ejemplo...');

        const vendedorData = {
            cedula: '87654321',
            password: 'vendedor123',
            email: 'vendedor@prestamos.com',
            role: UserRole.SELLER,
            // Campos específicos del perfil de vendedor
            nombre: 'Juan Carlos',
            apellido: 'Pérez López',
            telefono: '+573009876543',
            direccion: 'Calle 123 #45-67, Barranquilla',
            sucursal: 'Principal',
            comisionPorcentaje: 2.5,
            fechaIngreso: new Date(),
        };

        await authService.register(vendedorData);
        console.log('✅ Vendedor creado exitosamente');
        console.log('   Cédula: 87654321');
        console.log('   Password: vendedor123');

        // Crear un cliente de ejemplo
        console.log('👤 Creando cliente de ejemplo...');

        const clienteData = {
            cedula: '11223344',
            password: 'cliente123',
            email: 'cliente@ejemplo.com',
            role: UserRole.CLIENT,
            // Campos específicos del perfil de cliente
            nombre: 'María Elena',
            apellido: 'García Rodríguez',
            telefono: '+573001122334',
            direccion: 'Carrera 50 #30-15, Barranquilla',
            fechaNacimiento: new Date('1985-05-15'),
            profesion: 'Ingeniera de Sistemas',
            ingresosMensuales: 3500000,
            referencias: 'Empresa ABC - Tel: 3001234567',
        };

        await authService.register(clienteData);
        console.log('✅ Cliente creado exitosamente');
        console.log('   Cédula: 11223344');
        console.log('   Password: cliente123');

        // Crear datos adicionales de ejemplo
        console.log('📊 Creando datos adicionales...');

        // Crear un segundo vendedor
        const vendedor2Data = {
            cedula: '99887766',
            password: 'vendedor456',
            email: 'vendedor2@prestamos.com',
            role: UserRole.SELLER,
            nombre: 'Ana Sofia',
            apellido: 'Martínez Cruz',
            telefono: '+573005554433',
            direccion: 'Avenida del Río #789, Barranquilla',
            sucursal: 'Norte',
            comisionPorcentaje: 3.0,
            fechaIngreso: new Date(),
        };

        await authService.register(vendedor2Data);
        console.log('✅ Segundo vendedor creado');

        // Crear clientes adicionales
        const clientes = [
            {
                cedula: '55667788',
                password: 'cliente456',
                email: 'carlos@ejemplo.com',
                role: UserRole.CLIENT,
                nombre: 'Carlos Alberto',
                apellido: 'Rodríguez Silva',
                telefono: '+573007778899',
                direccion: 'Calle 45 #12-34, Barranquilla',
                fechaNacimiento: new Date('1990-08-20'),
                profesion: 'Contador Público',
                ingresosMensuales: 2800000,
                referencias: 'Empresa XYZ - Tel: 3009876543',
            },
            {
                cedula: '33445566',
                password: 'cliente789',
                email: 'lucia@ejemplo.com',
                role: UserRole.CLIENT,
                nombre: 'Lucía Fernanda',
                apellido: 'González Herrera',
                telefono: '+573001122334',
                direccion: 'Carrera 80 #55-22, Barranquilla',
                fechaNacimiento: new Date('1988-12-10'),
                profesion: 'Médica General',
                ingresosMensuales: 4200000,
                referencias: 'Hospital Central - Tel: 3005556677',
            }
        ];

        for (const clienteData of clientes) {
            await authService.register(clienteData);
            console.log(`✅ Cliente ${clienteData.nombre} creado`);
        }

        console.log('🎉 Seeder completado exitosamente');
        console.log('\n📋 Resumen de usuarios creados:');
        console.log('   👨‍💼 Administrador: 12345678 / admin123');
        console.log('   🏪 Vendedor 1: 87654321 / vendedor123');
        console.log('   🏪 Vendedor 2: 99887766 / vendedor456');
        console.log('   👤 Cliente 1: 11223344 / cliente123');
        console.log('   👤 Cliente 2: 55667788 / cliente456');
        console.log('   👤 Cliente 3: 33445566 / cliente789');

    } catch (error) {
        console.error('❌ Error durante el seeding:', error.message);

        if (error.message.includes('Ya existe un usuario')) {
            console.log('ℹ️  Los usuarios de ejemplo ya existen en la base de datos');
            console.log('💡 Para recrear los datos, elimina los registros existentes primero');
        }

        if (error.message.includes('violates not-null constraint')) {
            console.log('ℹ️  Error de campo requerido - verifica que todos los campos obligatorios estén presentes');
        }

        if (error.message.includes('duplicate key')) {
            console.log('ℹ️  Error de clave duplicada - algunos usuarios ya existen');
        }
    }

    await app.close();
}

// Función para verificar usuarios existentes
async function checkExistingUsers() {
    console.log('🔍 Verificando usuarios existentes...');

    const app = await NestFactory.create(AppModule);
    const authService = app.get(AuthService);

    try {
        // Obtener vendedores activos
        const sellers = await authService.getAllSellers();
        console.log(`📊 Vendedores encontrados: ${sellers.length}`);

        sellers.forEach(seller => {
            console.log(`   - ${seller.nombre} ${seller.apellido} (${seller.user?.cedula})`);
        });

        if (sellers.length > 0) {
            // Obtener clientes del primer vendedor como ejemplo
            const firstSeller = sellers[0];
            const clients = await authService.getClientsBySeller(firstSeller.id);
            console.log(`👥 Clientes del vendedor ${firstSeller.nombre}: ${clients.length}`);
        }

    } catch (error) {
        console.error('❌ Error verificando usuarios:', error.message);
    }

    await app.close();
}

// Función para limpiar datos existentes (usar con precaución)
async function cleanDatabase() {
    console.log('🧹 Limpiando base de datos...');
    console.log('⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de usuarios');

    const app = await NestFactory.create(AppModule);

    // Aquí podrías agregar lógica para limpiar la base de datos
    // NOTA: Implementar solo si es necesario y con mucho cuidado

    await app.close();
}

// Función principal con opciones
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'check':
            await checkExistingUsers();
            break;
        case 'clean':
            console.log('⚠️  Función de limpieza no implementada por seguridad');
            break;
        default:
            await seed();
            break;
    }
}

// Ejecutar el seeder
main().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});