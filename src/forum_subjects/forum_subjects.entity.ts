import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('forum_subjects')
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  created_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
