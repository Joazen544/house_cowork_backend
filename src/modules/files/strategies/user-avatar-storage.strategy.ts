import { bucketConfig } from '../bucket-config';
import { FileCategory } from '../services/file-categories.enum';
import { FileStorageStrategy } from './file-storage-strategy.interface';
import { v4 as uuidv4 } from 'uuid';

export class UserAvatarStorageStrategy implements FileStorageStrategy {
  generateFileName(fileExt: string): string {
    return `${uuidv4()}.${fileExt}`;
  }

  getBucketName(): string {
    return bucketConfig.AVATARS;
  }

  getFileKey(fileName: string): string {
    return `${FileCategory.USER_AVATAR}/${fileName}`;
  }
}
