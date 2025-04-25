import { EmailClient } from '../providers/enums/email-client.enum';

export type EmailSendResult = {
  success: boolean;
  error?: string;
  sendAt?: Date;
}
