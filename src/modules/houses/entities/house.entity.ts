import { Task } from '../../tasks/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rule } from './rule.entity';
import { JoinRequest } from './join-request.entity';
import { Invitation } from './invitation.entity';
import { HouseUser } from './house-user.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Rule, (rule) => rule.house)
  rules!: Rule[];

  @OneToMany(() => HouseUser, (houseMember) => houseMember.house, { eager: true })
  houseMembers!: HouseUser[];

  @OneToMany(() => Task, (task) => task.house)
  tasks!: Task[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.house, { lazy: true })
  joinRequests!: JoinRequest[];

  @OneToMany(() => Invitation, (invitation) => invitation.house)
  invitations!: Invitation[];

  async members(): Promise<User[]> {
    const houseMembers = await this.houseMembers;
    const users = await Promise.all(houseMembers.map(async (houseMember) => await houseMember.member));
    return users;
  }
}
