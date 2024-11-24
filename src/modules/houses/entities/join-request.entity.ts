import { User } from '../../users/entities/user.entity';
import { House } from './house.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum JoinRequestStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELLED = 3,
}

@Entity()
export class JoinRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  houseId!: number;

  @ManyToOne(() => House, (house) => house.joinRequests, { eager: true })
  @JoinColumn({ name: 'houseId' })
  house!: House;

  @Column({ type: 'integer' })
  userId!: number;

  @ManyToOne(() => User, (user) => user.houseJoinRequests, { lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'integer', enum: JoinRequestStatus, default: JoinRequestStatus.PENDING })
  status!: JoinRequestStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
