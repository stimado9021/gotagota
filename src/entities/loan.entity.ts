import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';

export enum LoanStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Monto prestado

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  interestRate: number; // Tasa de interés (20%)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number; // Monto total con interés

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 5000 })
  dailyPayment: number; // Pago diario (5,000 pesos)

  @Column({ type: 'int' })
  totalDays: number; // Días totales para pagar

  @Column({ type: 'int', default: 0 })
  paidDays: number; // Días pagados

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number; // Monto pagado

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingAmount: number; // Monto pendiente

  @Column({ type: 'enum', enum: LoanStatus, default: LoanStatus.ACTIVE })
  status: LoanStatus;

  @Column({ type: 'date' })
  startDate: Date; // Fecha de inicio del préstamo

  @Column({ type: 'date' })
  endDate: Date; // Fecha límite para completar el pago

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.clientLoans)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column('uuid')
  clientId: string;

  @ManyToOne(() => User, user => user.lenderLoans)
  @JoinColumn({ name: 'lender_id' })
  lender: User;

  @Column('uuid')
  lenderId: string;

  @OneToMany(() => Payment, payment => payment.loan)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

