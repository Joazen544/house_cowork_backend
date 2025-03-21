import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_SERVICE, FileStorageService } from './file-storage.interface';
import { FileCategory } from '../enum/file-categories.enum';
import { v4 as uuidv4 } from 'uuid';
import { BucketConfigService } from './bucket-config.service';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
    private readonly bucketConfigService: BucketConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, category: FileCategory) {
    const { fileExt, originalName } = this.getFileExtensionAndOriginalName(file);

    if (!fileExt) {
      throw new BadRequestException('Invalid file extension!');
    }

    const fileName = this.generateFileName(category, originalName, fileExt);
    const bucketName = this.getBucketName(category);
    const key = this.getFileKey(category, fileName);

    await this.fileStorageService.uploadFile(file.buffer, bucketName, key, file.mimetype);

    return this.getUrl(category, fileName);
  }

  private getFileExtensionAndOriginalName(file: Express.Multer.File) {
    const lastDotIndex = file.originalname.lastIndexOf('.');
    const fileExt = lastDotIndex !== -1 ? file.originalname.substring(lastDotIndex + 1) : '';
    const originalName = lastDotIndex !== -1 ? file.originalname.substring(0, lastDotIndex) : file.originalname;
    return { fileExt, originalName };
  }

  private generateFileName(category: FileCategory, originalName: string, fileExt: string): string {
    switch (category) {
      case FileCategory.USER_AVATAR:
        return `${originalName}-${uuidv4()}.${fileExt}`;
      case FileCategory.HOUSE_AVATAR:
        return `${originalName}-${uuidv4()}.${fileExt}`;
      default:
        throw new BadRequestException('Invalid file category!');
    }
  }

  private getUrl(category: FileCategory, fileName: string) {
    const key = this.getFileKey(category, fileName);
    return `https://d1px1ztgevq7tr.cloudfront.net/${key}`;
  }

  private getBucketName(category: FileCategory) {
    return this.bucketConfigService.getBucketConfig(category);
  }

  private getFileKey(category: FileCategory, fileName: string) {
    let suffix: string;
    switch (category) {
      case FileCategory.USER_AVATAR:
      case FileCategory.HOUSE_AVATAR:
        suffix = fileName;
        break;
      default:
        throw new BadRequestException('Invalid file category!');
    }

    return `${category}/${suffix}`;
  }
}
