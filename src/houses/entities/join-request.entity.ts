import { User } from 'src/users/entities/user.entity';
import { House } from './house.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class JoinRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => House, (house) => house.joinRequests)
  house!: House;

  @ManyToOne(() => User, (user) => user.houseJoinRequests)
  user!: User;
}
