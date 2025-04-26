import { TemplateKey } from "aws-sdk/clients/panorama";
import { EmailRecordKey } from "../enums/email-record-key.enum";
import { EmailTemplateKey } from "../enums/email-template-key.enum";
import { EmailTemplateLanguage } from "../enums/email-template-language.enum";

export class EmailSendOptions<T extends EmailTemplateKey> {
    from: string;
    to: string;
    templateKey: T;
    language: EmailTemplateLanguage;
    variables: Record<EmailRecordKey, any>;
    sendAt: Date;

    constructor(from: string, to: string, templateKey: T, language: EmailTemplateLanguage, variables: Record<string, any>, sendAt: Date, version: number) {
        this.from = from
        this.to = to
        this.templateKey = templateKey
        this.language = language
        this.variables = variables
        this.sendAt = sendAt
    }
}