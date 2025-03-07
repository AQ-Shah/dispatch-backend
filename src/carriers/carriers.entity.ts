import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Company } from '../companies/companies.entity';

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  creation_time: Date;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ nullable: true })
  sales_team_id: number;

  @Column({ nullable: true })
  dispatch_team_id: number;

  @Column({ type: 'tinyint', default: 0 })
  sale_active: number;

  @Column({ nullable: true })
  sale_activation_dispatch_id: number;

  @Column({ type: 'datetime', nullable: true })
  sale_activation_date: Date;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'text', nullable: true })
  status_change_reason: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  dot_number: string;

  @Column({ nullable: true })
  mc_number: string;

  @Column({ nullable: true })
  dba: string;

  @Column({ nullable: true })
  business_address: string;

  @Column({ nullable: true })
  owner_name: string;

  @Column({ nullable: true })
  business_number: string;
}
