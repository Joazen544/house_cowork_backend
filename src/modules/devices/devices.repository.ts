import { BaseRepository } from 'src/common/repositories/base.repository';
import { Device, PushProvider } from './entities/device.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DevicesRepository extends BaseRepository<Device> {
  constructor(
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(Device, dataSource);
  }

  findOneByPushToken(pushToken: string, provider: PushProvider = PushProvider.FCM) {
    return this.deviceRepo.findOne({
      where: {
        isExpired: false,
        provider,
        pushToken,
      },
    });
  }

  findByUserId(userId: number) {
    return this.deviceRepo.find({
      where: {
        isExpired: false,
        userId,
      },
    });
  }
}
