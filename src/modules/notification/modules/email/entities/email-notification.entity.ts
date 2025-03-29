import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmailTemplate } from './email-template.entity';

export enum EmailSendStatus {
  PENDING = 1,
  SENT = 2,
  FAILED = 3,
}

@Entity()
export class EmailNotification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  targetEmail!: string;

  @Column()
  emailTemplateId!: number;

  @ManyToOne(() => EmailTemplate, (emailTemplate) => emailTemplate.emailNotifications)
  emailTemplate!: EmailTemplate;

  @Column({ type: 'jsonb' })
  variables!: Record<string, any>;

  @Column({ type: 'timestamptz' })
  sendAt!: Date;

  @Column({
    type: 'integer',
    enum: EmailSendStatus,
    default: EmailSendStatus.PENDING,
  })
  status!: EmailSendStatus;

  @Column({ nullable: true })
  errorMessage!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
