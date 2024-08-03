import { Task } from 'src/resources/tasks/entities/task.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @ManyToOne(() => House, (house) => house.rules)
  house!: House;
}
