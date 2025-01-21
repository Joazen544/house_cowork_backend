import { Injectable } from '@nestjs/common';
import { BucketConfigService } from '../services/bucket-config.service';
import { FileCategory } from '../enum/file-categories.enum';
import { FileStorageStrategy } from './file-storage-strategy.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserAvatarStorageStrategy implements FileStorageStrategy {
  constructor(private bucketConfigService: BucketConfigService) {}

  generateFileName(fileExt: string): string {
    return `${uuidv4()}.${fileExt}`;
  }

  getBucketName(): string {
    return this.bucketConfigService.getBucketConfig().AVATARS;
  }

  getFileKey(fileName: string): string {
    return `${FileCategory.USER_AVATAR}/${fileName}`;
  }
}
