import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  invitationCode!: string;

  @ManyToOne(() => House, (house) => house.invitations, { onDelete: 'CASCADE', eager: true })
  house!: House;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
