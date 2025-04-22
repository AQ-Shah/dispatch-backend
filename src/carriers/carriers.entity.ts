import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Truck } from '../trucks/trucks.entity';
import { CarrierDispatchLink } from '../carrier_dispatch_links/carrier_dispatch_links.entity';

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  mc_number?: string;

  @Column({ nullable: true })
  dot_number?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  dba?: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;
  
  @OneToMany(() => Truck, (truck) => truck.carrier)
  trucks: Truck[];

  @OneToMany(() => CarrierDispatchLink, (link) => link.carrier_id)
  dispatch_links: CarrierDispatchLink[];
}
