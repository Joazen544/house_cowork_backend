import { Injectable } from '@nestjs/common';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { EmailTemplateLanguage } from '../enums/email-template-language.enum';
import { EmailTemplatesRepository } from '../repositories/email-templates.repository';
import { EmailNotificationsRepository } from '../repositories/email-notifications.repository';
import { EmailSendStatus } from '../entities/email-notification.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
    private readonly emailNotificationsRepository: EmailNotificationsRepository,
  ) {}

  async createNotification(
    targetEmail: string,
    templateKey: EmailTemplateKey,
    language: EmailTemplateLanguage = EmailTemplateLanguage.EN,
    variables: Record<string, any>,
    sendAt: Date,
  ) {
    const emailTemplate = await this.emailTemplatesRepository.findLatestVersionByKeyAndLanguage(templateKey, language);

    if (!emailTemplate) {
      throw new Error('Email template not found');
    }

    const missingVariables = emailTemplate.variables.filter((key) => !(key in variables));

    if (missingVariables.length > 0) {
      throw new Error(`Missing required variables: ${missingVariables.join(', ')}`);
    }

    return await this.emailNotificationsRepository.create({
      targetEmail,
      emailTemplate,
      variables,
      sendAt,
      status: EmailSendStatus.PENDING,
    });
  }
}
