import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BucketConfigService {
  constructor(private configService: ConfigService) {}

  getBucketConfig() {
    const avatarsBucket = this.configService.get<string>('AVATARS_BUCKET');
    if (!avatarsBucket) {
      throw new Error('AVATARS_BUCKET configuration is not set');
    }
    return {
      AVATARS: avatarsBucket,
    };
  }
}
