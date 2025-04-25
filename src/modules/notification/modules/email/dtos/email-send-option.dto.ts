import { TemplateKey } from "aws-sdk/clients/panorama";
import { EmailRecordKey } from "../enums/email-record-key.enum";
import { EmailTemplateKey } from "../enums/email-template-key.enum";
import { EmailTemplateLanguage } from "../enums/email-template-language.enum";

export class EmailSendOptions<T extends EmailTemplateKey> {
    to: string;
    templateKey: T;
    language: EmailTemplateLanguage;
    variables: Record<EmailRecordKey, any>;
    sendAt: Date;

    constructor(to: string, templateKey: T, language: EmailTemplateLanguage, variables: Record<string, any>, sendAt: Date, version: number) {
        this.to = to
        this.templateKey = templateKey
        this.language = language
        this.variables = variables
        this.sendAt = sendAt
    }
}