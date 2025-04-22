import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column,
  } from 'typeorm';
  import { Truck } from '../trucks/trucks.entity';
  import { User } from '../users/users.entity';
  
  @Entity('truck_dispatchers')
  export class TruckDispatcher {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Truck, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'truck_id' })
    truck: Truck;
  
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dispatcher_user_id' })
    dispatcher: User;
  
    @Column({ type: 'boolean', default: true })
    active: boolean;
  
    @CreateDateColumn()
    assigned_at: Date;
  }
  