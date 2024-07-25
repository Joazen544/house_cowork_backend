import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { House } from 'src/houses/entities/house.entity';
import { TaskStatus } from './task-status.enum';
import { TaskPublicStatus } from './task-public-status.enum';

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
  })
  status!: TaskStatus;

  @Column({ type: 'datetime' })
  time!: string;

  @ManyToMany(() => User, (user) => user.assignedTasks)
  @JoinTable()
  assignedToUsers!: User[];

  @ManyToOne(() => House, (house) => house.tasks)
  house!: House;
}
