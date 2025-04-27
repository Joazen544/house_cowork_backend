import { IsIn, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "@aws-sdk/client-ses";

export class NotificationSendOption {
    @ApiProperty({ description: 'Recipient email or device ID', example: 'user@example.com' })
    @IsString()
    to: string;

    @ApiProperty({ description: "provider's email or device id" })
    @IsString()
    from: string;

    @ApiProperty({
        enum: Object.values(NotificationType),
        description: 'Business notification type',
    })
    @IsIn(Object.values(NotificationType))
    type: NotificationType;

    variable: Record<NotificationType, any>

    constructor(to: string, from: string, type: NotificationType, variable: Record<NotificationType, any>) {
        this.to = to
        this.from = from
        this.type = type
        this.variable = variable
    }

}