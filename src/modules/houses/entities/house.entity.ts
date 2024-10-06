import { Task } from '../../tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rule } from './rule.entity';
import { JoinRequest } from './join-request.entity';
import { Invitation } from './invitation.entity';
import { HouseMember } from './house-member.entity';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Rule, (rule) => rule.house, { eager: true, cascade: true })
  rules!: Rule[];

  @OneToMany(() => HouseMember, (houseMember) => houseMember.house, { eager: true })
  houseMembers!: HouseMember[];

  @OneToMany(() => Task, (task) => task.house)
  tasks!: Task[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.house, { lazy: true })
  joinRequests!: JoinRequest[];

  @OneToMany(() => Invitation, (invitation) => invitation.house)
  invitations!: Invitation[];
}
