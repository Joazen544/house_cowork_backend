import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { House } from '../../houses/entities/house.entity';
import { TaskAssignment } from './task-assignment.entity';

export enum TaskAccessLevel {
  ALL = 0,
  ASSIGNEE = 1,
}

export enum TaskStatus {
  OPEN = 0,
  IN_PROGRESS = 1,
  DONE = 2,
  CANCELLED = 3,
  REJECTED = 4,
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.ownedTasks, { eager: true })
  owner!: User;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: 'integer',
    enum: TaskAccessLevel,
    default: TaskAccessLevel.ALL,
  })
  accessLevel!: TaskAccessLevel;

  @Column({
    type: 'integer',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status!: TaskStatus;

  @Column({ type: 'timestamptz' })
  dueTime!: Date;

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.task, { eager: true, cascade: true })
  taskAssignments!: TaskAssignment[];

  @ManyToOne(() => House, (house) => house.tasks)
  house!: House;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
