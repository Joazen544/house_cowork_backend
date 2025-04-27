import { Injectable } from '@nestjs/common';
import { EmailService } from './modules/email/services/email.service';
import { EmailSendOption } from './modules/email/dtos/email-send-option.dto';
import { NotificationType } from 'src/common/dto/notification-type.enum';
import { Language } from 'src/common/dto/laguage-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService
  ) { }

  async sendEmail(to: string, from: string, type: NotificationType, sendAt: Date, variable: Record<NotificationType, any>, language: Language) {
    const key = this.emailService.findEmailTemplateKey(type)
    const sendOptions = new EmailSendOption(
      from, to, key, language, variable, sendAt,
    )
    this.emailService.send(sendOptions)
  }


  async sendAppPush(to: string, from: string, type: NotificationType, date: Date, variable: Record<NotificationType, any>) { }


}
