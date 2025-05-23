import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { JoinRequest } from '../../houses/entities/join-request.entity';
import { TaskAssignment } from '../../tasks/entities/task-assignment.entity';
import { HouseMember } from 'src/modules/houses/modules/house-members/house-member.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  avatarKey!: string;

  @OneToMany(() => Task, (task) => task.owner)
  ownedTasks!: Task[];

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.user)
  taskAssignments!: TaskAssignment[];

  @OneToMany(() => HouseMember, (houseMember) => houseMember.member, { lazy: true })
  houseMembers!: HouseMember[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.user)
  houseJoinRequests!: JoinRequest[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
