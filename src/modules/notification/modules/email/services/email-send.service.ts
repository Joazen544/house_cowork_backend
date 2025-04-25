import { Injectable } from "@nestjs/common";
import { AwsSesEmailClient } from "../providers/aws-ses-email-client";
import { EmailSendDetails } from "../dtos/email-send-detail.dto";

@Injectable()
export class EmailSendService {
    constructor(
        private readonly emailClient: AwsSesEmailClient
    ) { }

    async sendEmail(sendDetail: EmailSendDetails) {
        const result = await this.emailClient.sendEmail(sendDetail);
        return result;
    }


}