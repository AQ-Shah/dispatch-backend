import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../companies/companies.entity';
import { Team } from '../teams/teams.entity';
import { User } from '../users/users.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Team, (team) => team.department)
  teams: Team[];

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
