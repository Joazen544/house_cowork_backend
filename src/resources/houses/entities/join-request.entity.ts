import { User } from 'src/resources/users/entities/user.entity';
import { House } from './house.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JoinRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => House, (house) => house.joinRequests)
  house!: House;

  @ManyToOne(() => User, (user) => user.houseJoinRequests)
  user!: User;
}
