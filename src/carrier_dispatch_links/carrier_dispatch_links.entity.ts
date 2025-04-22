import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Company } from '../companies/companies.entity';
import { User } from '../users/users.entity';
import { Team } from '../teams/teams.entity';
import { Dispatch } from '../dispatches/dispatches.entity';

@Entity('carrier_dispatch_links')
export class CarrierDispatchLink {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dispatch_c_id' })
  dispatchCompany: Company;

  @Column()
  carrier_id: number;

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

  @Column({
    type: 'enum',
    enum: ['Engaged', 'Paused', 'Discontinued', 'Flagged'],
    default: 'Engaged',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  status_change_reason: string;

  @Column({ type: 'boolean', default: false })
  sale_matured: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  percentage_cut: number;
}
