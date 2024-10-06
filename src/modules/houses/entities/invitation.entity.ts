import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  invitationCode!: string;

  @ManyToOne(() => House, (house) => house.invitations)
  house!: House;

  @Column({ type: 'datetime' })
  expiresAt!: Date;

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
