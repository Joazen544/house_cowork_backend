import { Injectable } from '@nestjs/common';
import { FileCategory } from '../services/file-categories.enum';
import { FileStorageStrategy } from './file-storage-strategy.interface';
import { UserAvatarStorageStrategy } from './user-avatar-storage.strategy';

@Injectable()
export class StrategyMapping {
  constructor(private userAvatarStorageStrategy: UserAvatarStorageStrategy) {}
  strategy: Record<FileCategory, FileStorageStrategy> = {
    [FileCategory.USER_AVATAR]: this.userAvatarStorageStrategy,
  };
}
