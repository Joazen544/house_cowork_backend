import { User } from '../../users/entities/user.entity';
import { House } from './house.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => House, (house) => house.joinRequests, { eager: true })
  house!: House;

  @ManyToOne(() => User, (user) => user.houseJoinRequests, { eager: true })
  user!: User;

  @Column({ type: 'integer', enum: JoinRequestStatus, default: JoinRequestStatus.PENDING })
  status!: JoinRequestStatus;
}
