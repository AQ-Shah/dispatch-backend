import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';
import { User } from '../users/users.entity';
import { Team } from '@app/teams/teams.entity';
import { Department } from '../departments/departments.entity';



@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;


  @OneToMany(() => Carrier, (carrier) => carrier.company)
  carriers: Carrier[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Department, (department) => department.company)
  departments: Department[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}
