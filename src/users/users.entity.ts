import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';
import { Company } from '../companies/companies.entity';
import { Team } from '../teams/teams.entity';
import { Department } from '../departments/departments.entity';
import { Role } from '../roles/roles.entity';
import { Permission } from '../permissions/permissions.entity';

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

  @Column({ nullable: true })
  designation: string; 

  @Column()
  phone: string;

  @Column()
  emergency_phone: string;

  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column()
  join_date: Date;

  @Column()
  leaving_date: Date;

  @Column({ default: 'employed' })
  current_status: string;

  @Column()
  photo_path: string;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dispatch_c_id' }) 
  company: Company;
  
  @ManyToOne(() => Carrier, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'carrier_id' }) 
  carrier: Carrier;
  
  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Team, { nullable: true, eager: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'team_id' })
  team: Team;
  
  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @OneToMany(() => Carrier, (carrier) => carrier.creator)
  carriers: Carrier[];
}
