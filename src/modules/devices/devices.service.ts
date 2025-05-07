import { Injectable, NotFoundException } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { DeviceRegistrationDto } from './dto/device-registration.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async registerDevice(dto: DeviceRegistrationDto) {
    const existingDevice = await this.devicesRepository.findNotExpiredOneByUserId(dto.userId, dto.provider);
    if (existingDevice) {
      existingDevice.pushToken = dto.pushToken;
      existingDevice.lastActiveAt = new Date();
      existingDevice.osVersion = dto.osVersion;
      existingDevice.appVersion = dto.appVersion;
      existingDevice.deviceModel = dto.deviceModel;
      existingDevice.isExpired = false;
      existingDevice.lastActiveAt = new Date();
      return this.devicesRepository.save(existingDevice);
    }
    return this.devicesRepository.create({
      ...dto,
      lastActiveAt: new Date(),
    });
  }

  async expireDevice(deviceId: number) {
    const device = await this.devicesRepository.findOneBy({ id: deviceId });
    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }
    device.isExpired = true;
    return this.devicesRepository.save(device);
  }
}
