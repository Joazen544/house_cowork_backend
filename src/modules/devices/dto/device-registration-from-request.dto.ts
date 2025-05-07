import { IsEnum, IsOptional } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
import { DevicePlatform, PushProvider } from '../entities/device.entity';

export class DeviceRegistrationFromRequestDto {
  @IsString()
  @IsNotEmpty()
  pushToken!: string;

  @IsEnum(PushProvider)
  @IsNotEmpty()
  provider!: PushProvider;

  @IsEnum(DevicePlatform)
  @IsNotEmpty()
  platform!: DevicePlatform;

  @IsString()
  @IsOptional()
  osVersion?: string;

  @IsString()
  @IsOptional()
  appVersion?: string;
  deviceModel?: string;
}
