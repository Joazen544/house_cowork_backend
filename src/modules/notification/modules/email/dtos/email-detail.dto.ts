import { IsDate, isEmail, IsEnum, IsOptional } from "class-validator";
import { EmailSendStatus } from "../entities/email-send-record.entity";

export class EmailDetailDto {
    id: number;
    targetEmail: string;
    emailTemplateId: number;
    variables: Record<string, any>;

    @IsDate()
    sendAt: Date;

    @IsEnum(EmailSendStatus)
    status: EmailSendStatus;

    @IsOptional()
    errorMessage: string;

    constructor(
        id: number,
        targetEmail: string,
        emailTemplateId: number,
        sendAt: Date,
        status: EmailSendStatus,
        errorMessage: string,
        variables: Record<string, any>,
    ) {
        this.id = id;
        this.targetEmail = targetEmail;
        this.emailTemplateId = emailTemplateId;
        this.variables = variables;
        this.sendAt = sendAt;
        this.status = status;
        this.errorMessage = errorMessage;
    }
}