import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileCategory } from '../enum/file-categories.enum';

@Injectable()
export class BucketConfigService {
  constructor(private configService: ConfigService) {}

  getBucketConfig(fileCategory: FileCategory): string {
    const avatarsBucket = this.configService.get<string>('AVATARS_BUCKET');
    if (!avatarsBucket) {
      throw new Error('AVATARS_BUCKET configuration is not set');
    }

    const bucketMapping: Record<FileCategory, string> = {
      [FileCategory.USER_AVATAR]: avatarsBucket,
      [FileCategory.HOUSE_AVATAR]: avatarsBucket,
    };

    const bucketName = bucketMapping[fileCategory];
    if (!bucketName) {
      throw new Error(`No bucket configuration found for file category: ${fileCategory}`);
    }

    return bucketName;
  }
}
