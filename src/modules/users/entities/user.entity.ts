import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { JoinRequest } from '../../houses/entities/join-request.entity';
import { TaskAssignment } from '../../tasks/entities/task-assignment.entity';
import { DeviceToken } from '../../device-tokens/entities/device-token.entity';
import { HouseUser } from 'src/modules/houses/entities/house-user.entity';
import { House } from 'src/modules/houses/entities/house.entity';

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

  @OneToMany(() => HouseUser, (houseUser) => houseUser.user)
  houseUsers!: HouseUser[];

  @OneToMany(() => JoinRequest, (joinRequest) => joinRequest.user)
  houseJoinRequests!: JoinRequest[];

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  deviceTokens!: DeviceToken[];

  houses(): House[] {
    return this.houseUsers.map((houseUser) => houseUser.house);
  }
}
