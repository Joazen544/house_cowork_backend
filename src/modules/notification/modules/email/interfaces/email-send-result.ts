import { EmailClient } from '../providers/enums/email-client.enum';

export type EmailSendResult = {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: EmailClient;
  sendAt?: Date;
}
