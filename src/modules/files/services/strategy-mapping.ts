import { Injectable } from '@nestjs/common';
import { FileCategory } from '../enum/file-categories.enum';
import { FileStorageStrategy } from '../strategies/file-storage-strategy.interface';
import { UserAvatarStorageStrategy } from '../strategies/user-avatar-storage.strategy';
import { HouseAvatarStorageStrategy } from '../strategies/house-avatar-storage.strategy';

@Injectable()
export class StrategyMapping {
  constructor(
    private userAvatarStorageStrategy: UserAvatarStorageStrategy,
    private houseAvatarStorageStrategy: HouseAvatarStorageStrategy,
  ) {}
  strategy: Record<FileCategory, FileStorageStrategy> = {
    [FileCategory.USER_AVATAR]: this.userAvatarStorageStrategy,
    [FileCategory.HOUSE_AVATAR]: this.houseAvatarStorageStrategy,
  };
}
