import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from '../departments/departments.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  team_name: string;

  @ManyToOne(() => Department, (department) => department.teams, { nullable: false, onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
