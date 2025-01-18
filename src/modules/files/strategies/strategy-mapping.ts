import { FileCategory } from '../services/file-categories.enum';
import { FileStorageStrategy } from './file-storage-strategy.interface';
import { UserAvatarStorageStrategy } from './user-avatar-storage.strategy';

export const strategyMapping: Record<FileCategory, FileStorageStrategy> = {
  [FileCategory.USER_AVATAR]: new UserAvatarStorageStrategy(),
};
