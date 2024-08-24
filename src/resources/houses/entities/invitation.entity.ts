import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { House } from './house.entity';

@Entity()
@Unique(['invitation_code'])
export class Invitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  invitation_code!: string;

  @ManyToOne(() => House, (house) => house.invitations)
  house!: House;

  @Column({ type: 'datetime' })
  expires_at!: Date;

  get isExpired(): boolean {
    return new Date() > this.expires_at;
  }
}
