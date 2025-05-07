import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { DeviceRegistrationDto } from './dto/device-registration.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async registerDevice(dto: DeviceRegistrationDto) {
    const existingDevice = await this.devicesRepository.findOneByPushToken(dto.pushToken);
    if (existingDevice) {
      if (existingDevice.userId !== dto.userId) {
        console.error(
          `Unexpected device registration conflict: pushToken=${dto.pushToken}, existingUserId=${existingDevice.userId}, newUserId=${dto.userId}`,
        );

        throw new InternalServerErrorException('Unexpected device registration conflict');
      }
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

  async getDeviceByUserId(userId: number) {
    return this.devicesRepository.findByUserId(userId);
  }
}
