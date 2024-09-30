import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, Unique } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { House } from '../../houses/entities/house.entity';
import { JoinRequest } from '../../houses/entities/join-request.entity';
import { TaskAssignment } from '../../tasks/entities/task-assignment.entity';
import { DeviceToken } from '../../device-tokens/entities/device-token.entity';

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

  @Column({ nullable: true })
  avatar!: string;

  @OneToMany(() => Task, (task) => task.owner)
  ownedTasks!: Task[];

  @OneToMany(() => TaskAssignment, (taskAssignment) => taskAssignment.user)
  taskAssignments!: TaskAssignment[];

  @ManyToMany(() => House, (house) => house.users)
  houses!: House[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.user)
  houseJoinRequests!: JoinRequest[];

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  deviceTokens!: DeviceToken[];
}
