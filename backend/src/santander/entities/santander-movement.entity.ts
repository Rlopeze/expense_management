import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('santander_movements')
export class SantanderMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  accountingDate: Date;

  @Column({ type: 'timestamp' })
  transactionDate: Date;

  @Column({ type: 'varchar', length: 50 })
  operationTime: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  newBalance: number;

  @Column({ type: 'varchar', length: 100 })
  codeOperationMovement: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  movementAmount: number;

  @Column({ type: 'text', nullable: true })
  observation: string;

  @Column({ type: 'varchar', length: 50 })
  expandedCode: string;

  @Column({ type: 'varchar', length: 50 })
  movementNumber: string;

  @Column({ type: 'varchar', length: 10 })
  chargePaymentFlag: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
