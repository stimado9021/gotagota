import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Prestamo } from "./prestamo.entity";

// src/prestamos/entities/pago-prestamo.entity.ts
@Entity('pagos_prestamos')
export class PagoPrestamo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    monto: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    montoCapital: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    montoInteres: number;

    @Column({ type: 'date' })
    fechaPago: Date;

    @Column({ type: 'date' })
    fechaVencimiento: Date;

    @Column({ type: 'int' })
    numeroCuota: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relaciones
    @Column()
    prestamoId: string;

    @ManyToOne(() => Prestamo, prestamo => prestamo.pagos)
    @JoinColumn({ name: 'prestamoId' })
    prestamo: Prestamo;
}