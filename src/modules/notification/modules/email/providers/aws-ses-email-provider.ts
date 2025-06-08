import { Injectable, Inject } from '@nestjs/common';
import { EmailProvider } from './interfaces/email-provider.interface';
import { EmailSendOptions } from '../dtos/email-send-options.dto';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailSendResult } from '../interfaces/email-send-result.interface';
import { EmailProvider as EmailProviderEnum } from './enums/email-provider.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsSesEmailProvider implements EmailProvider {
  private readonly ses: SESClient;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS configuration');
    }

    this.ses = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    const params = {
      Source: options.from,
      Destination: {
        ToAddresses: [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
        },
        Body: {
          Html: {
            Data: options.htmlBody,
          },
          Text: {
            Data: options.textBody,
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.ses.send(command);
      const isSuccess = response.MessageId !== undefined;
      return {
        success: isSuccess,
        messageId: response.MessageId,
        provider: EmailProviderEnum.AWS_SES,
        sendAt: new Date(),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      throw new Error('Failed to send email: Unknown error');
    }
  }
}
