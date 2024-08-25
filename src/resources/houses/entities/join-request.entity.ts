import { User } from 'src/resources/users/entities/user.entity';
import { House } from './house.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

enum JoinRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity()
export class JoinRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => House, (house) => house.joinRequests)
  house!: House;

  @ManyToOne(() => User, (user) => user.houseJoinRequests)
  user!: User;

  @Column({ type: 'enum', enum: JoinRequestStatus, default: JoinRequestStatus.PENDING })
  status!: JoinRequestStatus;
}
