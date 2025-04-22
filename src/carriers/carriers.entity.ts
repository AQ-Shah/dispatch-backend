import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Company } from '../companies/companies.entity';
import { Team } from '../teams/teams.entity';
import { Dispatch } from '../dispatches/dispatches.entity';

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  creation_time: Date;

  // 🔹 Relations
  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dispatch_c_id' })
  company: Company;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sales_team_id' })
  sales_team: Team;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dispatch_team_id' })
  dispatch_team: Team;

  @ManyToOne(() => Dispatch, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sale_matured_dispatch_id' })
  sale_matured_dispatch: Dispatch;

  // 🔹 Status & Tracking
  @Column({
    type: 'enum',
    enum: ['Engaged', 'Paused', 'Discontinued', 'Flagged'],
    default: 'Engaged',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  status_change_reason: string;

  // 🔹 Info
  @Column({ nullable: true })
  c_name: string;

  @Column({ nullable: true })
  c_email: string;

  @Column({ nullable: true })
  c_address_1: string;

  @Column({ nullable: true })
  c_address_2: string;

  @Column({ nullable: true })
  c_state: string;

  @Column({ nullable: true })
  c_zipcode: string;

  @Column({ nullable: true })
  dot_number: string;

  @Column({ nullable: true })
  mc_number: string;

  @Column({ nullable: true })
  dba: string;

  @Column({ type: 'boolean', default: false })
  sale_matured: boolean;
}
