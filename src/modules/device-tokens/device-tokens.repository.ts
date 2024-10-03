import { DataSource, Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

export class DeviceTokensRepository extends BaseRepository<DeviceToken> {
  constructor(
    @InjectRepository(DeviceToken) private readonly deviceTokensRepository: Repository<DeviceToken>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(DeviceToken, dataSource);
  }
}
