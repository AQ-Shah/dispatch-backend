import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { Team } from '../teams/teams.entity';
import { Department } from '../departments/departments.entity';
import { Role } from '../roles/roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  
  @Column({ unique: true })
  email: string;
  

  @Column()
  hashed_password: string;

  @Column()
  designation	: string;

  @Column()
  phone	: string;

  @Column()
  emergency_phone	: string;

  @Column()
  gender	: string;

  @Column()
  dob	: Date;

  @Column()
  join_date	: Date;

  @Column()
  leaving_date	: Date;

  @Column({ default: 'employed' })
  current_status: string;

  @Column()
  photo_path : string;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Team, { nullable: true, eager: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'team_id' })
  team: Team;
  
  // Fetch roles dynamically from `user_roles` table
  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  // Add One-to-Many relation: One user can create multiple carriers
  @OneToMany(() => Carrier, (carrier) => carrier.creator)
  carriers: Carrier[];
}
