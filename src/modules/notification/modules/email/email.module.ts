import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailTemplatesRepository } from './repositories/email-templates.repository';
import { EmailRecordRepository } from './repositories/email-record.repository'
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { EmailSendRecord } from './entities/email-send-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate, EmailSendRecord])],
  providers: [
    EmailService,
    EmailTemplatesRepository,
    EmailRecordRepository,
  ],
  exports: [EmailService],
})
export class EmailModule { }
