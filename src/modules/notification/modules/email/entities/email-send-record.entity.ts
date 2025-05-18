import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmailTemplate } from './email-template.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { EmailTemplateLanguage } from '../enums/email-template-language.enum';
import { EmailRecordKey } from '../enums/email-record-key.enum';

export enum EmailSendStatus {
  PENDING = 1,
  SENDING = 2,
  SENT = 3,
  FAILED = 4,
}

@Entity()
export class EmailSendRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  to!: string;

  @Column()
  emailTemplateId!: number;

  @Column({
    type: 'enum',
    enum: EmailTemplateKey,
    default: EmailTemplateKey.USER_SIGNUP_SUCCESS
  })
  emailTemplateKey!: EmailTemplateKey;

  @ManyToOne(() => EmailTemplate, (emailTemplate) => emailTemplate.emailNotifications)
  emailTemplate!: EmailTemplate;

  @Column({
    type: 'enum',
    enum: EmailTemplateLanguage,
    default: EmailTemplateLanguage.EN
  })
  language!: EmailTemplateLanguage;

  @Column({ type: 'jsonb' })
  variables!: Record<EmailRecordKey, any>;

  @Column({ type: 'timestamptz' })
  sendAt!: Date;

  @Column({
    type: 'integer',
    enum: EmailSendStatus,
    default: EmailSendStatus.PENDING,
  })
  status!: EmailSendStatus;

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
