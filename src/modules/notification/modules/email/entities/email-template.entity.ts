import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmailNotification } from './email-notification.entity';

@Entity()
@Index(['templateKey', 'language', 'version'], { unique: true })
export class EmailTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  templateKey!: string;

  @Column()
  version!: number;

  @Column()
  description!: string;

  @Column()
  subject!: string;

  @Column({ type: 'text' })
  bodyHTML!: string;

  @Column({ type: 'text' })
  bodyText!: string;

  @Column({ type: 'jsonb', nullable: true })
  variables!: string[];

  @Column({ default: 'en' })
  language!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => EmailNotification, (emailNotification) => emailNotification.emailTemplate)
  emailNotifications!: EmailNotification[];
}
