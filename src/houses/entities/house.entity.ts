import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  rules!: string[];

  @ManyToMany(() => User, (user) => user.houses)
  users!: User[];

  @OneToMany(() => Task, (task) => task.house)
  tasks!: Task[];
}
