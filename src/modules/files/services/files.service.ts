import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FILE_STORAGE_SERVICE, FileStorageService } from './file-storage.interface';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadImage(file: Express.Multer.File, folder: string) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed!');
    }

    const fileExt = file.originalname.split('.').pop();
    const fileKey = `${folder}/${uuidv4()}.${fileExt}`;

    await this.fileStorageService.uploadFile(file.buffer, fileKey, file.mimetype);

    return fileKey;
  }
}
