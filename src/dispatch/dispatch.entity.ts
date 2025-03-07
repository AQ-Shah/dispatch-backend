import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dispatch_list')
export class Dispatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  carrier_id: number;

  @Column()
  truck_id: number;

  @Column()
  load_details: string;

  @Column()
  dispatcher_id: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
