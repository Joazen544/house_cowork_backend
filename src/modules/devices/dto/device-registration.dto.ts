import { DevicePlatform, PushProvider } from '../entities/device.entity';

export class DeviceRegistrationDto {
  userId!: number;
  pushToken!: string;
  provider!: PushProvider;
  platform!: DevicePlatform;
  osVersion?: string;
  appVersion?: string;
  deviceModel?: string;
}
