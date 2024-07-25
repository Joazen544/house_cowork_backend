import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { House } from 'src/houses/entities/house.entity';

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

  @ManyToMany(() => User, (user) => user.assignedTasks)
  @JoinTable()
  assignedToUsers!: User[];

  @ManyToOne(() => House, (house) => house.tasks)
  house!: House;
}
