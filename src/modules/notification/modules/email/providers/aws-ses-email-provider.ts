import { Injectable } from '@nestjs/common';
import { EmailProvider } from './interfaces/email-provider.interface';
import { EmailSendOptions } from '../dtos/email-send-options.dto';
import * as AWS from 'aws-sdk';
import { EmailSendResult } from '../interfaces/email-send-result.interface';
import { EmailProvider as EmailProviderEnum } from './enums/email-provider.enum';

@Injectable()
export class AwsSesEmailProvider implements EmailProvider {
  private ses = new AWS.SES({ region: process.env.AWS_REGION });

  async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    const params = {
      Source: options.from,
      Destination: { ToAddresses: [options.to] },
      Message: {
        Subject: { Data: options.subject },
        Body: {
          Html: { Data: options.htmlBody },
          Text: { Data: options.textBody },
        },
      },
    };

    const response = await this.ses.sendEmail(params).promise();
    const isSuccess = response.MessageId !== undefined;
    return {
      success: isSuccess,
      messageId: response.MessageId,
      provider: EmailProviderEnum.AWS_SES,
      sendAt: new Date(),
    };
  }
}
