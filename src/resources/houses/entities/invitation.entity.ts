import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  invitation_code!: string;

  @ManyToOne(() => House, (house) => house.invitations)
  house!: House;
}
