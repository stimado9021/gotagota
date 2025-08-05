// src/prestamos/prestamos.service.ts
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';

import { Prestamo, EstadoPrestamo } from './entities/prestamo.entity';
import { PagoPrestamo } from './entities/pago-prestamo.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { CreateClientePrestamoDto } from './dto/create-cliente-prestamo.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';

@Injectable()
export class PrestamosService {
    constructor(
        @InjectRepository(Prestamo)
        private prestamoRepository: Repository<Prestamo>,
        @InjectRepository(PagoPrestamo)
        private pagoRepository: Repository<PagoPrestamo>,
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,
        @InjectRepository(Vendedor)
        private vendedorRepository: Repository<Vendedor>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // Calcular cuota mensual usando fórmula de amortización francesa
    private calcularCuotaMensual(monto: number, tasaInteres: number, plazoMeses: number): number {
        const tasaMensual = tasaInteres / 100 / 12;
        const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) /
            (Math.pow(1 + tasaMensual, plazoMeses) - 1);
        return Math.round(cuota * 100) / 100;
    }

    private calcularPlazoEnDias(monto: number): number {
        const pagoDiario = 5000;
        const montoConInteres = monto * 1.20; // Se le suma el 20% al monto inicial

        const dias = montoConInteres / pagoDiario;

        // Usamos Math.ceil para redondear al siguiente número entero,
        // asegurando que la deuda se pague completamente.
        return Math.ceil(dias);
    }




    // Crear cliente y préstamo en una sola operación
    async createClienteConPrestamo(vendedorId: string, createDto: CreateClientePrestamoDto) {
        // Verificar que el vendedor existe y está activo
        const vendedor = await this.vendedorRepository.findOne({
            where: { id: vendedorId, isActive: true },
            relations: ['user']
        });

        if (!vendedor) {
            throw new NotFoundException('Vendedor no encontrado o inactivo');
        }

        // Verificar si ya existe un usuario con esa cédula o email
        const existingUser = await this.userRepository.findOne({
            where: [
                { cedula: createDto.cedula },
                { email: createDto.email }
            ]
        });

        if (existingUser) {
            throw new BadRequestException('Ya existe un usuario con esa cédula o email');
        }

        // Generar contraseña temporal (cédula)
        const tempPassword = createDto.cedula;
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        // Crear usuario cliente
        const user = this.userRepository.create({
            cedula: createDto.cedula,
            email: createDto.email,
            password: hashedPassword,
            role: UserRole.CLIENT,
        });

        const savedUser = await this.userRepository.save(user);

        // Crear perfil de cliente
        const cliente = this.clienteRepository.create({
            nombre: createDto.nombre,
            apellido: createDto.apellido,
            telefono: createDto.telefono,
            direccion: createDto.direccion,

            userId: savedUser.id,
            vendedorId: vendedorId,
        });

        const savedCliente = await this.clienteRepository.save(cliente);

        // Calcular datos del préstamo
        const plazoDias = this.calcularPlazoEnDias(createDto.monto);

        // Calcular el monto total (incluyendo el 20% de interés)
        const montoTotal = createDto.monto * 1.20;

        const fechaInicio = new Date(createDto.fechaInicio);
        const fechaVencimiento = new Date(fechaInicio);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoDias); // Sumamos los días

        // Crear préstamo
        const prestamo = this.prestamoRepository.create({
            monto: createDto.monto, // Este es el monto inicial
            // La cuota mensual no aplica, pero la reemplazamos por un pago diario
            cuotaMensual: 5000,
            montoTotal, // Este es el monto total a pagar
            fechaInicio,
            fechaVencimiento,
            plazoDias,
            // ... otras propiedades
            clienteId: savedCliente.id,
            vendedorId: vendedorId,
        });

        const savedPrestamo = await this.prestamoRepository.save(prestamo);

        return {
            cliente: savedCliente,
            prestamo: savedPrestamo,
            credencialesTemporales: {
                cedula: savedUser.cedula,
                password: tempPassword,
                mensaje: 'Cliente creado exitosamente. Contraseña temporal: su número de cédula'
            }
        };
    }

    // Crear préstamo para cliente existente
    async createPrestamo(vendedorId: string, createDto: CreatePrestamoDto) {
        // Verificar vendedor
        console.log(vendedorId, createDto)
        const vendedor = await this.vendedorRepository.findOne({
            where: { id: vendedorId, isActive: true }
        });

        if (!vendedor) {
            throw new NotFoundException('Vendedor no encontrado o inactivo');
        }

        // Verificar cliente y que pertenezca al vendedor
        const cliente = await this.clienteRepository.findOne({
            where: {
                id: createDto.clienteId,
                isActive: true,
                vendedorId: vendedorId
            }
        });

        if (!cliente) {
            throw new NotFoundException('Cliente no encontrado o no pertenece a este vendedor');
        }

        // Verificar que el cliente no tenga préstamos activos
        const prestamoActivo = await this.prestamoRepository.findOne({
            where: {
                clienteId: createDto.clienteId,
                estado: EstadoPrestamo.ACTIVO,
                isActive: true
            }
        });

        if (prestamoActivo) {
            throw new BadRequestException('El cliente ya tiene un préstamo activo');
        }

        // Calcular datos del préstamo
        const plazoDias = this.calcularPlazoEnDias(
            createDto.monto,
        );

        const montoTotal = createDto.monto * 1.20;

        const fechaInicio = new Date(createDto.fechaInicio);
        const fechaVencimiento = new Date(fechaInicio);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoDias); // Sumamos los días

        // Crear préstamo
        const prestamo = this.prestamoRepository.create({
            ...createDto,
            monto: createDto.monto, // Este es el monto inicial
            // La cuota mensual no aplica, pero la reemplazamos por un pago diario
            cuotaMensual: 5000,
            montoTotal, // Este es el monto total a pagar
            fechaInicio,
            fechaVencimiento,
            plazoDias,
            // ... otras propiedades            
            vendedorId
        });



        return await this.prestamoRepository.save(prestamo);
    }

    // Obtener préstamos del vendedor
    async getPrestamosByVendedor(vendedorId: string, estado?: EstadoPrestamo) {

        console.log(vendedorId, estado)
        const where: any = {
            vendedorId,
            isActive: true
        };

        if (estado) {
            where.estado = estado;
        }

        return await this.prestamoRepository.find({
            where,
            relations: ['cliente', 'cliente.user'],
            order: { createdAt: 'DESC' }
        });
    }

    // Registrar pago
    async registrarPago(vendedorId: string, prestamoId: string, pagoDto: RegistrarPagoDto) {
        const prestamo = await this.prestamoRepository.findOne({
            where: {
                id: prestamoId,
                vendedorId,
                isActive: true
            },
            relations: ['pagos']
        });

        if (!prestamo) {
            throw new NotFoundException('Préstamo no encontrado');
        }

        if (prestamo.estado !== EstadoPrestamo.ACTIVO) {
            throw new BadRequestException('Solo se pueden registrar pagos en préstamos activos');
        }

        // Calcular siguiente número de cuota
        const numeroCuota = (prestamo.pagos?.length || 0) + 1;

        // Calcular distribución del pago (simplificado)
        const saldoPendiente = prestamo.montoTotal - prestamo.montoPagado;
        const porcentajeInteres = 0.7; // 70% interés, 30% capital (simplificado)

        const montoInteres = Math.min(pagoDto.monto * porcentajeInteres, saldoPendiente * 0.7);
        const montoCapital = pagoDto.monto - montoInteres;

        // Crear pago
        const pago = this.pagoRepository.create({
            monto: pagoDto.monto,
            montoCapital,
            montoInteres,
            fechaPago: new Date(pagoDto.fechaPago),
            fechaVencimiento: new Date(), // Calcular según cronograma
            numeroCuota,
            observaciones: pagoDto.observaciones,
            prestamo: prestamo, // <-- ¡ESTA ES LA CORRECCIÓN CLAVE! Asigna la ENTIDAD completa
        });

        prestamo.pagos.push(pago); // Añadir pago al préstamo

        // ELIMINA LA SIGUIENTE LÍNEA. ES REDUNDANTE Y PUEDE CAUSAR PROBLEMAS:
        pago.prestamoId = prestamoId;
        prestamo.id = prestamoId;


        const savedPago = await this.pagoRepository.save(pago);

        // Actualizar préstamo
        // Asegúrate de que los valores sean numéricos antes de sumar
        prestamo.montoPagado = Number(prestamo.montoPagado) + Number(pagoDto.monto);

        if (prestamo.montoPagado >= prestamo.montoTotal) {
            prestamo.estado = EstadoPrestamo.PAGADO;
        }
        console.log(prestamo.pagos);

        await this.prestamoRepository.save(prestamo);

        return savedPago;
    }

    // Obtener detalle de préstamo con pagos
    async getPrestamoDetalle(vendedorId: string, prestamoId: string) {
        const prestamo = await this.prestamoRepository.findOne({
            where: {
                id: prestamoId,
                vendedorId,
                isActive: true
            },
            relations: ['cliente', 'cliente.user', 'pagos']
        });

        if (!prestamo) {
            throw new NotFoundException('Préstamo no encontrado');
        }

        return prestamo;
    }

    async getCalendarioPagos(vendedorId: string, prestamoId: string) {
        const prestamo = await this.prestamoRepository.findOne({
            where: {
                id: prestamoId,
                vendedorId,
                isActive: true
            },
            relations: ['pagos']
        });

        if (!prestamo) {
            throw new NotFoundException('Préstamo no encontrado');
        }

        const pagos = prestamo.pagos || [];

        const calendario: { fecha: string; estado: 'pagado' | 'impago' | 'pendiente' }[] = [];

        const fechaInicio = new Date(prestamo.fechaInicio);
        const fechaVencimiento = new Date(prestamo.fechaVencimiento);
        const hoy = new Date();

        for (let i = 0; i < prestamo.plazoDias; i++) {
            const fechaActual = new Date(fechaInicio);
            fechaActual.setDate(fechaInicio.getDate() + i);

            // Convertimos a string YYYY-MM-DD para comparar y retornar
            const fechaStr = fechaActual.toISOString().split('T')[0];

            const fuePagado = pagos.some(pago => {
                const fechaPago = new Date(pago.fechaPago);
                return (
                    fechaPago.getFullYear() === fechaActual.getFullYear() &&
                    fechaPago.getMonth() === fechaActual.getMonth() &&
                    fechaPago.getDate() === fechaActual.getDate()
                );
            });

            let estado: 'pagado' | 'impago' | 'pendiente';

            if (fuePagado) {
                estado = 'pagado';
            } else if (fechaActual < hoy) {
                estado = 'impago';
            } else {
                estado = 'pendiente';
            }

            calendario.push({ fecha: fechaStr, estado });
        }

        return calendario;
    }



}
