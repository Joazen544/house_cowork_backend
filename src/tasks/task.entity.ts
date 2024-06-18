import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user)
  owner!: User;

  @Column()
  title!: number;

  @Column()
  description!: number;

  @ManyToMany(() => User, (user) => user.assignedTasks)
  @JoinTable()
  assignedToUsers!: User[];
}
