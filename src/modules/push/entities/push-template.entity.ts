import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('push_templates')
export class PushTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  key!: string;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  body!: string;

  @Column({ nullable: true })
  targetPage!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: 'en' })
  language!: string;
}
