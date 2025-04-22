import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { Truck } from '../trucks/trucks.entity';
import { User } from '../users/users.entity';
import { Invoice } from '@app/invoices/invoices.entity';

@Entity('dispatches')
export class Dispatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  load_number: string;

  @Column()
  pickup_location: string;

  @Column({ type: 'datetime' })
  pickup_datetime: Date;

  @Column()
  dropoff_location: string;

  @Column({ type: 'datetime' })
  dropoff_datetime: Date;

  @Column({ nullable: true })
  broker_name?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate: number;

  @Column()
  commodity: string;

  @Column()
  trailer_type: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'enum', enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Column({
    type: 'enum',
    enum: ['not_ready', 'ready_for_invoice', 'invoiced'],
    default: 'not_ready',
  })
  invoice_status: string;

  // Relations
  @ManyToOne(() => Carrier, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carrier_id' })
  carrier: Carrier;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Truck, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'truck_id' })
  truck: Truck;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dispatcher_id' })
  dispatcher: User;  

  @ManyToOne(() => Invoice, (invoice) => invoice.dispatches, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
