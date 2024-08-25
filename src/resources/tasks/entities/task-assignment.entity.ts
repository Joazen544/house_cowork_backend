import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';

export enum TaskAssignmentStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELLED = 3,
}

@Entity()
export class TaskAssignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.taskAssignments)
  user!: User;

  @ManyToOne(() => Task, (task) => task.taskAssignments)
  task!: Task;

  @Column({
    type: 'integer',
    enum: TaskAssignmentStatus,
    default: TaskAssignmentStatus.PENDING,
  })
  assigneeStatus!: TaskAssignmentStatus;
}
