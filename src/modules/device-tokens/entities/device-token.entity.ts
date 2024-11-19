import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class DeviceToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @Column()
  device!: string;

  @ManyToOne(() => User, (user) => user.deviceTokens)
  user!: User;

  @Column()
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
