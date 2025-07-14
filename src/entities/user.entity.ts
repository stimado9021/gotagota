import { Entity, Column, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Loan } from './loan.entity';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  LENDER = 'lender', // prestamista/vendedor
  CLIENT = 'client',
  USER = "USER"
}

@Entity('users')
export class User {
  toSafeObject() {
    throw new Error('Method not implemented.');
  }

  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'cedula de usuario único',
    example: '10440747',
    minLength: 8,
    maxLength: 50,
  })
  @Column({ unique: true })
  cedula: string;


  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'john@example.com',
    format: 'email',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @Column()
  name: string;


  @ApiProperty({
    description: 'Contraseña del usuario (hasheada)',
    example: '$2b$10$...',
    writeOnly: true,
    minLength: 6,
  })
  @Column()
  @Exclude()
  password: string;


  @ApiProperty({
    description: 'Telefono  del usuario ',
    example: '+57 3003001794',
    writeOnly: true,
    minLength: 15,
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Direccion  del usuario ',
    example: 'carrera 4B #42-84 buenos aires Barranquilla',
    writeOnly: true,
    minLength: 75,
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.CLIENT,
    default: UserRole.CLIENT,
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Loan, loan => loan.client)
  clientLoans: Loan[];

  @OneToMany(() => Loan, loan => loan.lender)
  lenderLoans: Loan[];

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-01-01T00:00:00.000Z',
    readOnly: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2025-01-01T00:00:00.000Z',
    readOnly: true,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}