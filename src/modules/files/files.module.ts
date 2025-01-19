import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { FILE_STORAGE_SERVICE } from './services/file-storage.interface';
import { S3Service } from './services/s3.service';
import { ConfigModule } from '@nestjs/config';
import { BucketConfigService } from './services/bucket-config.service';
import { StrategyMapping } from './strategies/strategy-mapping';
import { UserAvatarStorageStrategy } from './strategies/user-avatar-storage.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    FilesService,
    BucketConfigService,
    StrategyMapping,
    UserAvatarStorageStrategy,
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: S3Service,
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
