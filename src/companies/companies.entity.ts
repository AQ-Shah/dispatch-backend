import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Carrier } from '../carriers/carriers.entity';
import { User } from '../users/users.entity';
import { Department } from '../departments/departments.entity';


@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Carrier, (carrier) => carrier.company)
  carriers: Carrier[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Department, (department) => department.company)
  deparments: Department[];
}
