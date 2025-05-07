import { DevicePlatform, PushProvider } from '../entities/device.entity';

export class DeviceRegistrationDto {
  userId!: number;
  deviceToken!: string;
  provider!: PushProvider;
  platform!: DevicePlatform;
  osVersion?: string;
  appVersion?: string;
  deviceModel?: string;
}
