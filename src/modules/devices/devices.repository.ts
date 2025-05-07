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

  findNotExpiredOneByUserId(userId: number, provider: PushProvider = PushProvider.FCM) {
    return this.deviceRepo.findOne({
      where: {
        userId,
        isExpired: false,
        provider,
      },
    });
  }
}
