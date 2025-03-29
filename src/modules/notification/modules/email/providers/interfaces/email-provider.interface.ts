import { EmailSendOptions } from '../../dtos/email-send-options.dto';
import { EmailSendResult } from '../../interfaces/email-send-result.interface';

export interface EmailProvider {
  sendEmail(options: EmailSendOptions): Promise<EmailSendResult>;
}
