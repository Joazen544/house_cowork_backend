import { Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';

export class DeviceTokensRepository {
  constructor(private readonly deviceTokensRepository: Repository<DeviceToken>) {}
}
