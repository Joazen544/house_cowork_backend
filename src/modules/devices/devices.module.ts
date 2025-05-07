import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DevicesRepository } from './devices.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService, DevicesRepository],
  controllers: [DevicesController],
})
export class DevicesModule {}
