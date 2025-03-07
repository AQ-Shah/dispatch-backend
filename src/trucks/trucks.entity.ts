import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carrier, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carrier_id' })
  carrier: Carrier;

  @Column()
  truck_number: string;

  @Column()
  status: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  driver_name: string;

  @Column({ nullable: true })
  driver_contact: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
