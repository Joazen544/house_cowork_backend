import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokensController } from './device-tokens.controller';
import { DeviceTokensService } from './device-tokens.service';
import { DeviceTokensRepository } from './device-tokens.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  controllers: [DeviceTokensController],
  providers: [DeviceTokensService, DeviceTokensRepository],
  exports: [DeviceTokensService],
})
export class DeviceTokensModule {}
