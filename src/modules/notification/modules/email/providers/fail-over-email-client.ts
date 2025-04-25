import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailClient } from './interfaces/email-client.interface';
import { EmailSendDetails } from '../dtos/email-send-detail.dto';
import { EmailSendResult } from '../interfaces/email-send-result';

@Injectable()
export class FailoverEmailProvider implements EmailClient {
  private readonly logger = new Logger(FailoverEmailProvider.name);

  constructor(@Inject('ThirdPartyEmailProviders') private readonly providers: EmailClient[]) { }

  async sendEmail(options: EmailSendDetails): Promise<EmailSendResult> {
    for (const provider of this.providers) {
      try {
        const sendEmailResult = await provider.sendEmail(options);
        if (sendEmailResult.success === true) {
          return sendEmailResult;
        }

        this.logger.warn(
          `Failed to send email using ${provider.constructor.name}, due to ${sendEmailResult.error} trying next provider...`,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to send email using ${provider.constructor.name}, error:${error} trying next provider...`,
        );
      }
    }

    this.logger.error('All email providers failed to send the email.');
    return { success: false };
  }
}
