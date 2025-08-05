import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { PagoPrestamo } from './pago-prestamo.entity';

export enum EstadoPrestamo {
    ACTIVO = 'activo',
    PAGADO = 'pagado',
    VENCIDO = 'vencido',
    CANCELADO = 'cancelado'
}

export enum TipoPrestamo {
    PERSONAL = 'personal',
    VEHICULAR = 'vehicular',
    HIPOTECARIO = 'hipotecario',
    COMERCIAL = 'comercial'
}

@Entity('prestamos')
export class Prestamo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    monto: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    tasaInteres: number;

    @Column({ type: 'int', nullable: true })
    plazoMeses: number;

    @Column({ type: 'int', nullable: true })
    plazoDias: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    cuotaMensual: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    montoPagado: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    montoTotal: number;

    @Column({
        type: 'enum',
        enum: EstadoPrestamo,
        default: EstadoPrestamo.ACTIVO
    })
    estado: EstadoPrestamo;

    @Column({
        type: 'enum',
        enum: TipoPrestamo,
        default: TipoPrestamo.PERSONAL
    })
    tipo: TipoPrestamo;

    @Column({ type: 'date' })
    fechaInicio: Date;

    @Column({ type: 'date' })
    fechaVencimiento: Date;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relaciones
    @Column()
    clienteId: string;

    @ManyToOne(() => Cliente, cliente => cliente.prestamos)
    @JoinColumn({ name: 'clienteId' })
    cliente: Cliente;

    @Column()
    vendedorId: string;

    @ManyToOne(() => Vendedor, vendedor => vendedor.prestamos)
    @JoinColumn({ name: 'vendedorId' })
    vendedor: Vendedor;

    @OneToMany(() => PagoPrestamo, pago => pago.prestamo)
    pagos: PagoPrestamo[];
}