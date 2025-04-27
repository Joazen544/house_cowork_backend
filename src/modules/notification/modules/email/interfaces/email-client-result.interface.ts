import { EmailClient } from "../providers/enums/email-client.enum";

export interface EmailClientResult {
    isSuccess: boolean,
    messageId?: string,
    provider: EmailClient,
    error?: string,
    sendAt: Date
}