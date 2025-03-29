import { Module } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';
import { EmailService } from './services/email.service';
import { EmailTemplatesRepository } from './repositories/email-templates.repository';
import { EmailNotificationsRepository } from './repositories/email-notifications.repository';
import { FailoverEmailProvider } from './providers/fail-over-email-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { EmailNotification } from './entities/email-notification.entity';
import { AwsSesEmailProvider } from './providers/aws-ses-email-provider';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate, EmailNotification])],
  providers: [
    SendEmailService,
    EmailService,
    EmailTemplatesRepository,
    EmailNotificationsRepository,
    { provide: 'EmailProvider', useClass: FailoverEmailProvider },
    { provide: 'ThirdPartyEmailProviders', useValue: [AwsSesEmailProvider] },
  ],
  exports: [SendEmailService, EmailService],
})
export class EmailModule {}
