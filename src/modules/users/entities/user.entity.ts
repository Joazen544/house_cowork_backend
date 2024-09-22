import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, Unique } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { House } from 'src/modules/houses/entities/house.entity';
import { JoinRequest } from 'src/modules/houses/entities/join-request.entity';
import { TaskAssignment } from 'src/modules/tasks/entities/task-assignment.entity';

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

  @Column({ nullable: true })
  nickName!: string;

  @OneToMany(() => Task, (task) => task.owner)
  ownedTasks!: Task[];

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.user)
  taskAssignments!: TaskAssignment[];

  @ManyToMany(() => House, (house) => house.users)
  houses!: House[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.user)
  houseJoinRequests!: JoinRequest[];
}
