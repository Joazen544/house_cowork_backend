import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EmailTemplatesRepository } from './repositories/email-templates.repository';
import { EmailRecordRepository } from './repositories/email-record.repository';
import { FailoverEmailProvider } from './providers/fail-over-email-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { EmailSendRecord } from './entities/email-send-record.entity';
import { AwsSesEmailClient } from './providers/aws-ses-email-client';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate, EmailSendRecord])],
  providers: [
    EmailService,
    EmailTemplatesRepository,
    EmailRecordRepository,
    { provide: 'EmailProvider', useClass: FailoverEmailProvider },
    { provide: 'ThirdPartyEmailProviders', useValue: [AwsSesEmailClient] },
  ],
  exports: [EmailService],
})
export class EmailModule { }
