import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { House } from './house.entity';

export enum HouseMemberStatus {
  JOINED = 0,
  LEFT = 1,
}

@Entity()
export class HouseMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.houseMembers, { lazy: true })
  member!: User;

  @ManyToOne(() => House, (house) => house.houseMembers)
  house!: House;

  @Column({
    type: 'integer',
    enum: HouseMemberStatus,
    default: HouseMemberStatus.JOINED,
  })
  status!: HouseMemberStatus;
}
