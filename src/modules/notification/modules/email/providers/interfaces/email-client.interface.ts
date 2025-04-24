import { EmailSendOptions } from '../../dtos/email-send-options.dto';
import { EmailSendResult } from '../../interfaces/email-send-result';

export interface EmailClient {
  sendEmail(options: EmailSendOptions): Promise<EmailSendResult>;
}
