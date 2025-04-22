import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';
import { User } from '../users/users.entity';
import { TruckDispatcher } from '../truck_dispatchers/truck_dispatchers.entity';

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  truck_number: string;

  @Column({ nullable: true })
  vin?: string;

  @Column({ nullable: true })
  plate_number?: string;

  @Column({ nullable: true })
  type?: string; 

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  make?: string;

  @Column({ nullable: true })
  year?: string;

  @ManyToOne(() => Carrier, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carrier_id' })
  carrier: Carrier;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver_user_id' })
  driver?: User;

  @OneToMany(() => TruckDispatcher, (td) => td.truck)
  dispatcher_assignments: TruckDispatcher[];

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
