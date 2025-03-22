import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/modules/files/services/files.service';
import { House } from '../entities/house.entity';
import { FileCategory } from 'src/modules/files/enum/file-categories.enum';
import { HousesService } from './houses.service';

@Injectable()
export class HouseAvatarService {
  constructor(
    private readonly housesService: HousesService,
    private readonly filesService: FilesService,
  ) {}

  async uploadAvatar(house: House, file: Express.Multer.File) {
    const newImageKey = await this.filesService.uploadFile(file, FileCategory.HOUSE_AVATAR);

    const originalAvatarKey = house.avatarKey;

    const userObject = await this.housesService.update(house, { avatarKey: newImageKey });
    const avatarUrl = this.filesService.getUrl(newImageKey);

    const updatedHouseObject = {
      ...userObject,
      avatar: avatarUrl,
    };

    if (originalAvatarKey) {
      await this.filesService.deleteFile(FileCategory.HOUSE_AVATAR, house.avatarKey);
    }

    return updatedHouseObject;
  }
}
