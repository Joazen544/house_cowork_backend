import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, Unique } from 'typeorm';
import { Task } from '../../tasks/task.entity';

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

  @OneToMany(() => Task, (task) => task.owner)
  ownedTasks!: Task[];

  @ManyToMany(() => Task, (task) => task.assignedToUsers)
  assignedTasks!: Task[];
}
