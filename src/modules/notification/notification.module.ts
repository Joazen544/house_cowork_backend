import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
