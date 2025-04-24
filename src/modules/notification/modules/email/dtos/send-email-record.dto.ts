import { EmailSendStatus } from "../entities/email-detail.entity";
import { EmailTemplateKey } from "../enums/email-template-key.enum";
import { EmailTemplateLanguage } from "../enums/email-template-language.enum";

export class SendEmailRecordDto<T extends EmailTemplateKey> {
    constructor(
        public targetEmail: string,
        public templateKey: T,
        public language: EmailTemplateLanguage,
        public variables: Record<string, any>,
        public status: EmailSendStatus,
        public sendAt: Date,
    ) { }
}