// src/vendedor/entities/vendedor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity';

@Entity()
export class Vendedor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ nullable: true })
    telefono: string;

    @Column({ nullable: true })
    direccion: string;

    @Column({ type: 'date' })
    fechaIngreso: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salario: number;

    @Column({ nullable: true })
    departamento: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Relación uno a uno con User
    @Column()
    userId: string;

    @OneToOne(() => User, user => user.vendedor)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Relación uno a muchos con Cliente (un vendedor puede tener múltiples clientes)
    @OneToMany(() => Cliente, (cliente) => cliente.vendedor)
    clientes: Cliente[];

    @OneToMany(() => Prestamo, (prestamo) => prestamo.vendedor)
    prestamos: Prestamo[];
}