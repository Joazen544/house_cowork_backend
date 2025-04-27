import { Language } from "src/common/dto/laguage-type.enum";
import { EmailRecordKey } from "../enums/email-record-key.enum";
import { EmailTemplateKey } from "../enums/email-template-key.enum";

export class EmailSendOption<T extends EmailTemplateKey> {
    from: string;
    to: string;
    templateKey: T;
    language: Language;
    variables: Record<EmailRecordKey, any>;
    sendAt: Date;

    constructor(from: string, to: string, templateKey: T, language: Language, variables: Record<string, any>, sendAt: Date) {
        this.from = from
        this.to = to
        this.templateKey = templateKey
        this.language = language
        this.variables = variables
        this.sendAt = sendAt
    }
}