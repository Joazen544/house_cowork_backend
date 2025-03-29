import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplatesRepository } from '../repositories/email-templates.repository';
import { EmailProvider } from '../providers/interfaces/email-provider.interface';
import { EmailSendOptions } from '../dtos/email-send-options.dto';
import { EmailNotificationsRepository } from '../repositories/email-notifications.repository';
import { EmailNotification, EmailSendStatus } from '../entities/email-notification.entity';

@Injectable()
export class SendEmailService {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
    private readonly emailNotificationsRepository: EmailNotificationsRepository,
    @Inject('EmailProvider') private readonly emailProvider: EmailProvider,
  ) {}

  async sendEmailByProvider(emailNotification: EmailNotification) {
    const emailTemplate = await this.emailTemplatesRepository.findOneBy({ id: emailNotification.emailTemplateId });

    if (emailTemplate === null) {
      throw new Error('Email template not found');
    }
    const emailOption = new EmailSendOptions(
      emailNotification.targetEmail,
      'johnsonjiang@housecowork.com',
      emailTemplate.subject,
      emailTemplate.bodyHTML,
      emailTemplate.bodyText,
    );

    const sendEmailResult = await this.emailProvider.sendEmail(emailOption);
    const emailSendStatus = sendEmailResult.success ? EmailSendStatus.SENT : EmailSendStatus.FAILED;
    await this.emailNotificationsRepository.update(emailNotification.id, { status: emailSendStatus });
  }
}
