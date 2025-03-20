import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Permission } from '../permissions/permissions.entity';

@Entity('user_permissions')
export class UserPermission {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  permission_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
