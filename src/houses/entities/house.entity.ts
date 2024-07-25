import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  rules!: string[];
}
