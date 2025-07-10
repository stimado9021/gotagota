import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Loan } from './loan.entity';

export enum PaymentStatus {
  PAID = 'paid',     // Verde - Pagado
  UNPAID = 'unpaid', // Rojo - No pagado
  PARTIAL = 'partial' // Amarillo - Pago parcial
}

@Entity('payments')
@Index(['id', 'paymentDate'], { unique: true })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  paymentDate: Date; // Fecha del pago programado

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 5000 })
  expectedAmount: number; // Monto esperado (5,000)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number; // Monto realmente pagado

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date; // Momento exacto del pago

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isLate: boolean; // Si el pago fue tardío

  @Column({ type: 'int', default: 1 })
  dayNumber: number; // Número del día en el cronograma

  @ManyToOne(() => Loan, loan => loan.payments)
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column('uuid')
  loanId: string;

  @CreateDateColumn()
  createdAt: Date;
}
