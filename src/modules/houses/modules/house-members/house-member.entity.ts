import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { House } from 'src/modules/houses/entities/house.entity';

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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
