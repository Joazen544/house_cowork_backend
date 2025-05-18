import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmailSendRecord } from './email-send-record.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { Language } from 'src/common/dto/laguage-type.enum';

@Entity()
@Index(['templateKey', 'language', 'version'], { unique: true })
export class EmailTemplate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: EmailTemplateKey,
    enumName: 'email_template_key_enum',
    nullable: false,
  })
  templateKey!: EmailTemplateKey;

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

  @Column({
    type: 'enum',
    enum: Language,
    enumName: 'language_enum',
    nullable: false
  })
  language!: Language;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => EmailSendRecord, (emailNotification) => emailNotification.emailTemplate)
  emailNotifications!: EmailSendRecord[];
}
