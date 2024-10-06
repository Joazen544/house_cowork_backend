import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @ManyToOne(() => House, (house) => house.rules, { onDelete: 'CASCADE' })
  house!: House;
}
