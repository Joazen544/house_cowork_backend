import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, Unique } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { House } from 'src/resources/houses/entities/house.entity';
import { JoinRequest } from 'src/resources/houses/entities/join-request.entity';

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

  @ManyToMany(() => Task, (task) => task.assignees)
  assignedTasks!: Task[];

  @ManyToMany(() => House, (house) => house.users)
  houses!: House[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.user)
  houseJoinRequests!: JoinRequest[];
}
