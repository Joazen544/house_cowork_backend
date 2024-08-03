import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { House } from 'src/resources/houses/entities/house.entity';

export enum TaskPublicStatus {
  ALL = 0,
  ASSIGNEE = 1,
}

export enum TaskStatus {
  OPEN = 0,
  IN_PROGRESS = 1,
  DONE = 2,
  CANCELED = 3,
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.ownedTasks)
  owner!: User;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: 'integer',
    enum: TaskPublicStatus,
    default: TaskPublicStatus.ALL,
  })
  publicStatus!: TaskPublicStatus;

  @Column({
    type: 'integer',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status!: TaskStatus;

  @Column({ type: 'datetime' })
  dueTime!: Date;

  @ManyToMany(() => User, (user) => user.assignedTasks)
  @JoinTable()
  assignees!: User[];

  @ManyToOne(() => House, (house) => house.tasks)
  house!: House;
}
