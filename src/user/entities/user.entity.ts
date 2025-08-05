// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { Admin } from 'src/admin/entities/admin.entity';

export enum UserRole {
    CLIENT = 'client',
    SELLER = 'seller',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    cedula: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Relaciones uno a uno con los perfiles específicos
    @OneToOne(() => Cliente, cliente => cliente.user)
    cliente: Cliente;

    @OneToOne(() => Vendedor, vendedor => vendedor.user)
    vendedor: Vendedor;

    @OneToOne(() => Admin, admin => admin.user)
    admin: Admin;
}