import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Loan } from './loan.entity';

export enum TransactionType {
  LOAN_CREATED = 'loan_created',
  PAYMENT_MADE = 'payment_made',
  PAYMENT_OVERDUE = 'payment_overdue',
  LOAN_COMPLETED = 'loan_completed',
  LOAN_CANCELLED = 'loan_cancelled'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any; // Datos adicionales en formato JSON

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Loan, { nullable: true })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column('uuid', { nullable: true })
  loanId: string;

  @CreateDateColumn()
  createdAt: Date;
}