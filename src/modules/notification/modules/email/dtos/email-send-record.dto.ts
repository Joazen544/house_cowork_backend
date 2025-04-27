import { EmailSendStatus } from "../entities/email-send-record.entity";
import { EmailRecordKey } from "../enums/email-record-key.enum";
import { EmailTemplateKey } from "../enums/email-template-key.enum";
import { EmailTemplateLanguage } from "../enums/email-template-language.enum";

export class EmailSendRecord<T extends EmailTemplateKey> {
    to: string;
    from: string;
    templateKey: T;
    language: EmailTemplateLanguage;
    variables: Record<EmailRecordKey, any>;
    sendAt: Date;
    status: EmailSendStatus;
    errorMessage: string;

    constructor(to: string, from: string, templateKey: T, language: EmailTemplateLanguage, variables: Record<string, any>, sendAt: Date, expiredAt: Date, status: EmailSendStatus, errorMessage: string) {
        this.to = to;
        this.from = from;
        this.templateKey = templateKey;
        this.language = language;
        this.variables = variables;
        this.sendAt = sendAt;
        this.status = status;
        this.errorMessage = errorMessage;
    }
}