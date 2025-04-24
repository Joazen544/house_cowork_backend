import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmailDetail } from './email-detail.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { EmailTemplateLanguage } from '../enums/email-template-language.enum';

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
    enum: EmailTemplateLanguage,
    enumName: 'email_template_language_enum',
    nullable: false
  })
  language!: EmailTemplateLanguage;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => EmailDetail, (emailNotification) => emailNotification.emailTemplate)
  emailNotifications!: EmailDetail[];
}
