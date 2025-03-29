import { EmailProvider } from '../providers/enums/email-provider.enum';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: EmailProvider;
  sendAt?: Date;
}
