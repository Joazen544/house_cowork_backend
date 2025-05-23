import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

export enum PushProvider {
  FCM = 'FCM',
}

export enum DevicePlatform {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

@Entity('devices')
@Unique(['provider', 'pushToken'])
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  pushToken!: string;

  @Column()
  provider!: PushProvider;

  @Column()
  platform!: DevicePlatform;

  @Column({ nullable: true })
  osVersion?: string;

  @Column({ nullable: true })
  appVersion?: string;

  @Column({ nullable: true })
  deviceModel?: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastActiveAt?: Date;

  @Column({ default: false })
  isExpired!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
