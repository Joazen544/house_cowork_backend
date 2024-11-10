import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { House } from '../houses/entities/house.entity';

export enum HouseMemberStatus {
  JOINED = 0,
  LEFT = 1,
}

@Entity()
@Unique(['member', 'house'])
export class HouseMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  memberId!: number;

  @ManyToOne(() => User, (user) => user.houseMembers, { lazy: true })
  @JoinColumn({ name: 'memberId' })
  member!: User;

  @Column()
  houseId!: number;

  @ManyToOne(() => House, (house) => house.houseMembers, { lazy: true })
  @JoinColumn({ name: 'houseId' })
  house!: House;

  @Column({
    type: 'integer',
    enum: HouseMemberStatus,
    default: HouseMemberStatus.JOINED,
  })
  status!: HouseMemberStatus;
}
