import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  role_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
