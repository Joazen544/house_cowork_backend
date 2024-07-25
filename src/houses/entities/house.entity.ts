import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rule } from './rule.entity';

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

  @ManyToMany(() => User, (user) => user.houses)
  users!: User[];

  @OneToMany(() => Task, (task) => task.house)
  tasks!: Task[];
}
