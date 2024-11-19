import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @ManyToOne(() => House, (house) => house.rules, { onDelete: 'CASCADE' })
  house!: House;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
