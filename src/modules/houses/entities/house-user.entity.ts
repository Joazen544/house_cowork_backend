import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { House } from './house.entity';

export enum HouseUserStatus {
  JOINED = 0,
  LEFT = 1,
}

@Entity()
export class HouseUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.houseUsers)
  user!: User;

  @ManyToOne(() => House, (house) => house.houseUsers)
  house!: House;

  @Column({
    type: 'integer',
    enum: HouseUserStatus,
    default: HouseUserStatus.JOINED,
  })
  status!: HouseUserStatus;
}