import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { DeviceRegistrationDto } from './dto/device-registration.dto';
import { Device } from './entities/device.entity';

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

        throw new ConflictException('Device registration conflict');
      }
      this.updateDeviceDetails(existingDevice, dto);
      existingDevice.lastActiveAt = new Date();
      return this.devicesRepository.save(existingDevice);
    }
    return this.devicesRepository.create({
      ...dto,
      lastActiveAt: new Date(),
    });
  }

  private updateDeviceDetails(device: Device, dto: DeviceRegistrationDto) {
    device.pushToken = dto.pushToken;
    device.osVersion = dto.osVersion;
    device.appVersion = dto.appVersion;
    device.deviceModel = dto.deviceModel;
    device.isExpired = false;
  }

  async updateLastActiveAt(deviceId: number) {
    const device = await this.devicesRepository.findOneBy({ id: deviceId });
    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }
    device.lastActiveAt = new Date();
    device.isExpired = false;
    return this.devicesRepository.save(device);
  }

  async expireDevice(deviceId: number) {
    const device = await this.devicesRepository.findOneBy({ id: deviceId });
    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }
    device.isExpired = true;
    return this.devicesRepository.save(device);
  }

  async getByUserId(userId: number) {
    return this.devicesRepository.findByUserId(userId);
  }
}
