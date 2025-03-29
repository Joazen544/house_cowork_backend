import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailProvider } from './interfaces/email-provider.interface';
import { EmailSendOptions } from '../dtos/email-send-options.dto';
import { EmailSendResult } from '../interfaces/email-send-result.interface';

@Injectable()
export class FailoverEmailProvider implements EmailProvider {
  private readonly logger = new Logger(FailoverEmailProvider.name);

  constructor(@Inject('ThirdPartyEmailProviders') private readonly providers: EmailProvider[]) {}

  async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
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
