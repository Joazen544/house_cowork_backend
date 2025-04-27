import { Body, Injectable } from "@nestjs/common";
import { EmailSendDetails } from "../dtos/email-send-detail.dto";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { EmailClientResult } from "../interfaces/email-client-result.interface";
import { EmailClient } from "../providers/enums/email-client.enum";

@Injectable()
export class EmailSendService {
    sesClient;
    constructor() {
        this.sesClient = new SESClient([{
            credentials: {
                accessKeyId: process.env.AWS_ACCCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            region: process.env.AWS_REGION,
        }]);
    }

    async sendEmail(sendDetails: EmailSendDetails): Promise<EmailClientResult> {
        const params = {
            Destination: {
                ToAddresses: [sendDetails.to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: sendDetails.htmlBody,
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: sendDetails.textBody,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: sendDetails.subject,
                },
            },
            Source: sendDetails.from,
        }

        const command = new SendEmailCommand(params);

        try {
            const clientResult = await this.sesClient.send(command);
            return {
                isSuccess: true,
                provider: EmailClient.AWS_SES,
                messageId: clientResult.MessageId,
                sendAt: new Date()
            }
        } catch (e) {
            return {
                isSuccess: false,
                provider: EmailClient.AWS_SES,
                error: 'Failed to send email: ' + e,
                sendAt: new Date()
            }

        }
    }
}