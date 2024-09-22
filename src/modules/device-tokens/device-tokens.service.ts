import { Injectable } from '@nestjs/common';
import { DeviceTokensRepository } from './device-tokens.repository';

@Injectable()
export class DeviceTokensService {
  constructor(private readonly deviceTokensRepository: DeviceTokensRepository) {}
}
