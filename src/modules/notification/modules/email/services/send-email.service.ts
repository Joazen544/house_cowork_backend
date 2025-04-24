import { Injectable } from "@nestjs/common";
import { AwsSesEmailClient } from "../providers/aws-ses-email-client";
import { EmailSendOptions } from "../dtos/email-send-options.dto";

@Injectable()
export class SendEmailService {
    constructor(
        private readonly emailClient: AwsSesEmailClient
    ) { }

    async sendEmail(sendOptions: EmailSendOptions) {
        const result = await this.emailClient.sendEmail(sendOptions);
        return result;
    }
}