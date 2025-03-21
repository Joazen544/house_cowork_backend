import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';

export enum TaskAssignmentStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELLED = 3,
  DONE = 4,
}

@Entity()
export class TaskAssignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.taskAssignments, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  taskId!: number;

  @ManyToOne(() => Task, (task) => task.taskAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task!: Task;

  @Column({
    type: 'integer',
    enum: TaskAssignmentStatus,
    default: TaskAssignmentStatus.PENDING,
  })
  assigneeStatus!: TaskAssignmentStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
