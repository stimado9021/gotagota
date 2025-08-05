// src/cliente/entities/cliente.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity';

@Entity()
export class Cliente {
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

    @Column({ type: 'date', nullable: true })
    fechaNacimiento: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Relación uno a uno con User
    @Column()
    userId: string;

    @OneToOne(() => User, user => user.cliente)
    @JoinColumn({ name: 'userId' })
    user: User;

    // Relación muchos a uno con Vendedor (un cliente puede tener un vendedor asignado)
    @Column({ nullable: true })
    vendedorId: string;

    @ManyToOne(() => Vendedor, (vendedor) => vendedor.clientes)
    @JoinColumn({ name: 'vendedorId' })
    vendedor: Vendedor;

    @OneToMany(() => Prestamo, (prestamo) => prestamo.cliente)
    prestamos: Prestamo[];
}