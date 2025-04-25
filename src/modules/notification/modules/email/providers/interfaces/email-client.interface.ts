import { EmailSendDetails } from '../../dtos/email-send-detail.dto';
import { EmailSendResult } from '../../interfaces/email-send-result';

export interface EmailClient {
  sendEmail(options: EmailSendDetails): Promise<EmailSendResult>;
}
