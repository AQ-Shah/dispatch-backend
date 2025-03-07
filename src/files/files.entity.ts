import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('file_library')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column()
  file_path: string;

  @Column()
  uploaded_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;
}
